import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 CONFIGURAÇÃO BLINDADA COM VARIÁVEIS DE AMBIENTE DO NEXT.JS
// O prefixo NEXT_PUBLIC_ permite que o Next.js repasse as chaves com segurança para o lado do cliente (navegador).
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Evita erros em produção caso o desenvolvedor esqueça de configurar o arquivo .env
if (Object.values(firebaseConfig).some((value) => !value)) {
  throw new Error(
    '❌ BlazeTrack Error: Algumas variáveis de ambiente do Firebase estão ausentes no arquivo .env.local'
  );
}

// No Next.js, durante o desenvolvimento, o código é re-executado a cada alteração.
// Verificamos se já existe um app inicializado para evitar o erro "FirebaseApp: App name [DEFAULT] already exists".
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };