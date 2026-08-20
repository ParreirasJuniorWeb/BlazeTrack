"use client";

// react native hooks
import { useEffect, useState, useTransition } from "react";

// Redux Provider
import { Provider } from "react-redux";

// Configurações padrão da Redux Store
import { makeStore, AppStore } from "./index";

// Firebase user status state monitoring function
import { onAuthStateChanged } from "firebase/auth";

// Firebase native functions to make database previews
import { doc, getDoc } from "firebase/firestore";

// Firebase Configurations
import { auth, db } from "../config/firebase";

// redex Slices
import {
  setAuthenticatedUser,
  setAuthLoading,
} from "../features/auth/authSlice";

// Cookies
import Cookies from "js-cookie";

// Loader component
import Loading from "../components/ui/Loading/Loading";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState<AppStore>(() => makeStore());

  // controladores de estados assíncronos

  const [isPending, startTransition] = useTransition();

  // 🌍 LISTENER GLOBAL DE SESSÃO (Roda uma única vez na inicialização do app)
  useEffect(() => {
    if (!store) return;

    // Ativa o estado de carregamento inicial do app enquanto checa a sessão
    store.dispatch(setAuthLoading(true));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        startTransition(async () => {
          try {
            // Busca os metadados complementares (como nome completo) salvos no Firestore
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userSnapshot = await getDoc(userDocRef);

            let userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "Membro BlazeTrack",
              photoURL: firebaseUser.photoURL || "",
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            };

            if (userSnapshot.exists()) {
              const dbData = userSnapshot.data();
              userData = {
                ...userData,
                displayName: dbData.displayName || userData.displayName,
                createdAt: dbData.createdAt?.toDate
                  ? dbData.createdAt.toDate().toISOString()
                  : userData.createdAt.toString(),
              };
            }

            // 1. Sincroniza a Store do Redux com os dados reais
            store.dispatch(setAuthenticatedUser(userData));

            // 2. Garante que o cookie correto com o UID real seja salvo para o Middleware
            Cookies.set("blazetrack_session", firebaseUser.uid, {
              expires: 7,
              secure: true,
            });
          } catch (error) {
            console.error(
              "Erro ao sincronizar dados do usuário no refresh:",
              error,
            );
            store.dispatch(setAuthenticatedUser(null));
            Cookies.remove("blazetrack_session");
          }
        });
      } else {
        // Se o usuário não está mais logado no Firebase (ou deslogou), limpa o ecossistema
        store.dispatch(setAuthenticatedUser(null));
        Cookies.remove("blazetrack_session");

        // Se o cookie estivesse gravado como a string "undefined", essa linha limpa o bug visual do print
        if (Cookies.get("blazetrack_session") === "undefined") {
          Cookies.remove("blazetrack_session");
        }
      }
    });

    // Remove o listener da memória se o componente for desmontado por completo
    return () => unsubscribe();
  }, []);

  if(isPending) return (
    <div className="px-50 mx-auto py-50">
      <Loading isLoading={isPending} />
    </div>
  );

  return <Provider store={store}>{children}</Provider>;
}
