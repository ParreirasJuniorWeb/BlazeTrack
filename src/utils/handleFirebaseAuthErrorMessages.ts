import type { FirebaseError } from "firebase/app";

// Convert Firebase error codes/objects into friendly messages
export function handleErrorMessages(error: FirebaseError) {
    if (!error) return "Ocorreu um erro desconhecido.";

    // If error is an object from Firebase, it may contain `code` or `message`.
    const code = typeof error === "string" ? error : error.code || "";

    switch (code) {
        case "auth/operation-not-allowed":
            return "O sistema falhou em abrir conexão com o Apple/Google Authenticator Provider.";
        case "auth/invalid-credential":
            return "Credenciais inválidas.";
        case "auth/email-already-in-use":
            return "Este e-mail já está em uso. Faça login ou use outro e-mail.";
        case "auth/invalid-email":
            return "O e-mail informado é inválido. Verifique e tente novamente.";
        case "auth/user-not-found":
            return "Usuário não encontrado. Verifique seu e-mail ou registre-se.";
        case "auth/wrong-password":
            return "Senha incorreta. Verifique sua senha e tente novamente.";
        case "auth/weak-password":
            return "A senha é fraca. Use pelo menos 6 caracteres.";
        case "auth/too-many-requests":
            return "Muitas tentativas. Tente novamente mais tarde.";
        case "auth/network-request-failed":
            return "Falha na rede. Verifique sua conexão e tente novamente.";
        default:
            // Fallback: if error.message exists, use it; otherwise generic message
            return error && error.message
                ? error.message
                : "Ocorreu um erro ao processar sua solicitação.";
    }
}