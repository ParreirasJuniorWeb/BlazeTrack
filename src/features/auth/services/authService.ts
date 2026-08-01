import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    updateProfile,
    User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { LoginCredentials, RegisterCredentials, UserProfile } from '../types';

// Helper privado para criar ou atualizar o documento do usuário no Firestore
const syncUserWithFirestore = async (user: FirebaseUser, additionalData?: { displayName?: string }) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const profileData: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: additionalData?.displayName || user.displayName || 'Usuário BlazeTrack',
        photoURL: user.photoURL || '',
        createdAt: userSnap.exists() ? userSnap.data().createdAt : serverTimestamp(),
        lastLogin: serverTimestamp(),
    };

    // Salva ou atualiza no Firestore sem sobrescrever dados antigos indesejados
    await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
    return profileData;
};

export const authService = {
    // 1. Cadastro Manual (E-mail, Senha e Nome Completo)
    register: async ({ name, email, password }: RegisterCredentials): Promise<UserProfile> => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Atualiza o perfil nativo do Firebase Auth com o nome completo
        await updateProfile(userCredential.user, { displayName: name });

        // Sincroniza com a coleção 'users' no Firestore
        return await syncUserWithFirestore(userCredential.user, { displayName: name });
    },

    // 2. Login Manual (E-mail e Senha)
    loginWithEmail: async ({ email, password }: LoginCredentials): Promise<UserProfile> => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return await syncUserWithFirestore(userCredential.user);
    },

    // 3. Login Social (Google)
    loginWithGoogle: async (): Promise<UserProfile> => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        return await syncUserWithFirestore(userCredential.user);
    },

    // 4. Login Social (GitHub)
    loginWithGithub: async (): Promise<UserProfile> => {
        const provider = new GithubAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        return await syncUserWithFirestore(userCredential.user);
    }
};