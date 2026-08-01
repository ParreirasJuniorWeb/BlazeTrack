import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    getDocs,
    or,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { ITask, TaskInput, TaskStatus } from '../types';

export const taskService = {
    // 1. Criar uma nova tarefa
    createTask: async (userId: string, taskData: TaskInput): Promise<ITask> => {
        const tasksCollection = collection(db, 'tasks');

        const newTaskPayload = {
            title: taskData.title,
            description: taskData.description,
            isPublic: taskData.isPublic ?? false,
            deadline: taskData.deadline ?? null,
            userId,
            status: 'stopped' as TaskStatus,         // Por padrão, toda tarefa nasce na baia "Parado"
            pomodoroTimeSpent: 0,      // Inicia com zero segundos acumulados
            comments: [],              // Inicia sem comentários nas discussões
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        // Salva no Firestore e gera um ID automático
        const docRef = await addDoc(tasksCollection, newTaskPayload);

        return {
            id: docRef.id,
            ...newTaskPayload,
            createdAt: new Date().toISOString(), // Fallback local para a UI imediata
            updatedAt: new Date().toISOString(),
        };
    },

    // 2. Listar tarefas do usuário conectado (com filtros automáticos)
    getTasksByUser: async (userId: string): Promise<ITask[]> => {
        const tasksCollection = collection(db, 'tasks');

        // Cria uma query protegida por userId e ordenada pelas tarefas mais recentes
        // 🌍 QUERY AVANÇADA: Retorna documentos onde (O dono é o usuário atual) OU (A tarefa é pública)
        const q = query(
            tasksCollection,
            or(
                where('userId', '==', userId),
                where('isPublic', '==', true)
            ),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const tasks: ITask[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            tasks.push({
                id: doc.id,
                userId: data.userId,
                title: data.title,
                description: data.description,
                status: data.status || 'stopped',
                isPublic: data.isPublic ?? false,
                deadline: data.deadline || null,
                pomodoroTimeSpent: data.pomodoroTimeSpent || 0,
                comments: data.comments || [],
                // Converte o Timestamp do Firebase para String ISO legível para evitar quebras no Redux Store
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : '',
                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : '',
            });
        });

        return tasks;
    },

    // 3. Atualizar dados gerais ou Status da tarefa (ex: Mudar para Concluída)
    // Suporta qualquer campo dinâmico
    updateTask: async (taskId: string, fieldsToUpdate: Partial<Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
        const taskDocRef = doc(db, 'tasks', taskId);

        const updatePayload = {
            ...fieldsToUpdate,
            updatedAt: serverTimestamp(),
        };

        await updateDoc(taskDocRef, updatePayload);
    },

    // 4. Deletar uma tarefa permanentemente
    deleteTask: async (taskId: string): Promise<void> => {
        const taskDocRef = doc(db, 'tasks', taskId);
        await deleteDoc(taskDocRef);
    }
};