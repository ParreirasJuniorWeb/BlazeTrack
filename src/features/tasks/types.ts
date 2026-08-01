// 1. Definição estrita dos estados possíveis de uma tarefa no sistema
// Atualização das colunas Kanban (Estilo Monday.com)
export type TaskStatus = 'stopped' | 'progress' | 'done'; // Parado, Em Andamento, Feito

export interface IComment {
    id: string;
    userId: string;
    userName: string;
    userPhoto: string;
    text: string;
    createdAt: string;
}

// 2. Modelo completo de uma tarefa cadastrada no Firestore
export interface ITask {
    id: string;          // ID gerado automaticamente pelo Firestore
    userId: string;      // ID do usuário criador (vínculo com Firebase Auth)
    title: string;       // Título descritivo da tarefa
    description: string; // Detalhes ou subtarefas da demanda
    status: TaskStatus;  // Status de monitoramento da tarefa
    isPublic: boolean;    // Flag de visibilidade global
    deadline: string | null; // Prazo de entrega
    pomodoroTimeSpent: number; // Tempo acumulado em segundos (Pomodoro)
    comments: IComment[]; // Lista de comentários nativos
    createdAt: string;   // Data de criação formatada como string ISO
    updatedAt: string;   // Data da última modificação formatada como string ISO
}

// 3. Modelo de dados necessário estritamente para a criação de uma nova tarefa
// Removemos os campos de controle de infraestrutura (id, userId, status, datas) que o Firestore injeta automaticamente
export type TaskInput = Omit<ITask, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>;

// 4. Estrutura do Estado Inicial da feature no Redux Toolkit
export interface TasksState {
    items: ITask[];           // Array de tarefas listadas do usuário
    isLoading: boolean;       // Controla estados de esqueleto/loading na tela
    isSubmitting: boolean;    // Controla o estado de envio exclusivo de formulários (evita cliques duplos)
    error: string | null;     // Mensagem de erro capturada de falhas no banco
    filter: TaskStatus | 'all'; // Filtro ativo na visualização do painel
}

import { z } from 'zod';

// Esquema Zod atualizado para o modal de criação
export const taskFormSchema = z.object({
    title: z.string()
        .min(1, 'O título é obrigatório')
        .min(3, 'O título deve conter pelo menos 3 caracteres')
        .max(50, 'Título longo demais (máximo 50)'),
    description: z.string()
        .min(1, 'A descrição é obrigatória')
        .max(200, 'Descrição longa demais (máximo 200)'),
    isPublic: z.boolean().default(false),
    deadline: z.string().nullable().optional(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
