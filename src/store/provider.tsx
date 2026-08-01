"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./index";
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { setAuthenticatedUser, setAuthLoading } from '../features/auth/authSlice';
import Cookies from 'js-cookie';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState<AppStore>(() => makeStore());

  // 🌍 LISTENER GLOBAL DE SESSÃO (Roda uma única vez na inicialização do app)
  useEffect(() => {
    if (!store) return;

    // Ativa o estado de carregamento inicial do app enquanto checa a sessão
    store.dispatch(setAuthLoading(true));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Busca os metadados complementares (como nome completo) salvos no Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnapshot = await getDoc(userDocRef);
          
          let userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Membro BlazeTrack',
            photoURL: firebaseUser.photoURL || '',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };

          if (userSnapshot.exists()) {
            const dbData = userSnapshot.data();
            userData = {
              ...userData,
              displayName: dbData.displayName || userData.displayName,
              createdAt: dbData.createdAt?.toDate ? dbData.createdAt.toDate().toISOString() : userData.createdAt.toString()
            };
          }

          // 1. Sincroniza a Store do Redux com os dados reais
          store.dispatch(setAuthenticatedUser(userData));
          
          // 2. Garante que o cookie correto com o UID real seja salvo para o Middleware
          Cookies.set('blazetrack_session', firebaseUser.uid, { expires: 7, secure: true });

        } catch (error) {
          console.error("Erro ao sincronizar dados do usuário no refresh:", error);
          store.dispatch(setAuthenticatedUser(null));
          Cookies.remove('blazetrack_session');
        }
      } else {
        // Se o usuário não está mais logado no Firebase (ou deslogou), limpa o ecossistema
        store.dispatch(setAuthenticatedUser(null));
        Cookies.remove('blazetrack_session');
        
        // Se o cookie estivesse gravado como a string "undefined", essa linha limpa o bug visual do print
        if (Cookies.get('blazetrack_session') === 'undefined') {
          Cookies.remove('blazetrack_session');
        }
      }
    });

    // Remove o listener da memória se o componente for desmontado por completo
    return () => unsubscribe();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
