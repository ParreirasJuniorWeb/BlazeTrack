import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

// 1. Esquema de Validação para Login
export const loginSchema = z.object({
    email: z.string()
        .min(1, 'O e-mail é obrigatório')
        .email('Insira um formato de e-mail válido'),
    password: z.string()
        .min(6, 'A senha deve conter pelo menos 6 caracteres'),
});

// 2. Esquema de Validação para Registro (Cadastro)
export const registerSchema = z.object({
    name: z.string()
        .min(3, 'O nome deve conter pelo menos 3 caracteres')
        .max(50, 'Nome longo demais'),
    email: z.string()
        .min(1, 'O e-mail é obrigatório')
        .email('Insira um formato de e-mail válido'),
    password: z.string()
        .min(6, 'A senha deve conter pelo menos 6 caracteres'),
    confirmPassword: z.string()
        .min(1, 'A confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'], // Atribui o erro diretamente ao campo confirmPassword
});

// --- Tipagens Extraídas dos Esquemas do Zod ---
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;

// --- Tipagens de Estado da Aplicação e do Firestore ---
export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    createdAt: Timestamp | string; // Armazena o FieldValue do Firestore
    lastLogin: any;
}

export interface AuthState {
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;
}
