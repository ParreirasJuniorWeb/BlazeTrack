import type { UserProfile } from "../features/auth/types"

const AUTH_STORAGE_KEY = "blazetrack_auth_user";

export function saveAuthToStorage(user: Partial<Pick<UserProfile, "uid" | "email" | "displayName">>) {
    try {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Erro ao salvar sessão no localStorage:", error);
    }
}

export function loadAuthFromStorage() {
    try {
        if (typeof window === "undefined") return null;
        const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (error) {
        console.error("Erro ao carregar sessão do localStorage:", error);
        return null;
    }
}

export function clearAuthFromStorage() {
    try {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
        console.error("Erro ao remover sessão do localStorage:", error);
    }
}
