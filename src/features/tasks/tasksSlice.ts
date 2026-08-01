import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskService } from './services/taskService';
import { TasksState, ITask, TaskInput, TaskStatus } from './types';
import { RootState } from '../../store/index';

const initialState: TasksState = {
    items: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    filter: 'all',
};

// --- Thunks Assíncronas (Ações integradas ao Firestore) ---

// 1. Buscar tarefas do usuário conectado
export const fetchTasks = createAsyncThunk(
    'tasks/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const userId = state.auth.user?.uid;

            if (!userId) throw new Error('Usuário não autenticado.');

            return await taskService.getTasksByUser(userId);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erro ao carregar tarefas.');
        }
    }
);

// 2. Adicionar uma nova tarefa
export const addTask = createAsyncThunk(
    'tasks/add',
    async (taskData: TaskInput, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const userId = state.auth.user?.uid;

            if (!userId) throw new Error('Usuário não autenticado.');

            return await taskService.createTask(userId, taskData);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erro ao criar tarefa.');
        }
    }
);

// 3. Alternar o status da tarefa (Pendente <=> Concluída)
export const toggleTaskStatus = createAsyncThunk(
    'tasks/toggleStatus',
    async ({ taskId, currentStatus }: { taskId: string; currentStatus: TaskStatus }, { rejectWithValue }) => {
        try {
            const newStatus: TaskStatus = currentStatus === 'stopped' ? 'done' : 'stopped';
            await taskService.updateTask(taskId, { status: newStatus });
            return { taskId, newStatus };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erro ao atualizar status.');
        }
    }
);

// 4. Deletar uma tarefa
export const deleteTask = createAsyncThunk(
    'tasks/delete',
    async (taskId: string, { rejectWithValue }) => {
        try {
            await taskService.deleteTask(taskId);
            return taskId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erro ao deletar tarefa.');
        }
    }
);

// --- O Slice de Gerenciamento de Estado Global ---

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // Ação síncrona para alterar o filtro visual na tela (Pendente, Concluída ou Todas)
        setFilter: (state, action: PayloadAction<TaskStatus | 'all'>) => {
            state.filter = action.payload;
        },
        clearTasksError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Casos específicos de Sucesso (Fulfilled)
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<ITask[]>) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(addTask.fulfilled, (state, action: PayloadAction<ITask>) => {
                state.isSubmitting = false;
                state.items.unshift(action.payload); // Adiciona a nova tarefa no topo da lista
            })
            .addCase(toggleTaskStatus.fulfilled, (state, action: PayloadAction<{ taskId: string; newStatus: TaskStatus }>) => {
                state.isSubmitting = false;
                const task = state.items.find(t => t.id === action.payload.taskId);
                if (task) {
                    task.status = action.payload.newStatus;
                }
            })
            .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
                state.isSubmitting = false;
                state.items = state.items.filter(t => t.id !== action.payload);
            })

            // Gerenciamento Inteligente de Carregamento (Matchers)
            .addMatcher(
                (action) => action.type === fetchTasks.pending.type,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => [addTask.pending.type, toggleTaskStatus.pending.type, deleteTask.pending.type].includes(action.type),
                (state) => {
                    state.isSubmitting = true;
                    state.error = null;
                }
            )
            // Gerenciamento Unificado de Erros (Rejected Matcher)
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.isSubmitting = false;
                    state.error = action.payload;
                }
            );
    },
});

// Seletores Memorizados para Filtragem Direta no seletor (Boa prática de Performance)
export const selectFilteredTasks = (state: RootState) => {
    const { items, filter } = state.tasks;
    if (filter === 'all') return items;
    return items.filter((task) => task.status === filter);
};

export const selectTaskMetrics = (state: RootState) => {
    const items = state.tasks.items;

    const total = items.length;
    const completed = items.filter(task => task.status === 'done').length;
    const pending = total - completed;

    // Calcula a taxa de conclusão (evita divisão por zero)
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
        total,
        completed,
        pending,
        completionRate
    };
};

export const { setFilter, clearTasksError } = tasksSlice.actions;
export default tasksSlice.reducer;