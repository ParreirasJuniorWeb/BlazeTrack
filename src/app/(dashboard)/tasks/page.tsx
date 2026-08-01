"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchTasks,
  setFilter,
  selectFilteredTasks,
  toggleTaskStatus,
  deleteTask,
} from "../../../features/tasks/tasksSlice";
import { TaskStatus } from "../../../features/tasks/types";
import type { ITask } from "../../../features/tasks/types";
import { TaskForm } from "@/src/features/tasks/components/TaskForm";

export default function TasksPage() {
  const dispatch = useAppDispatch();

  // Consome os estados globais e o seletor de filtragem otimizado
  const filteredTasks = useAppSelector(selectFilteredTasks) as ITask[];
  const { isLoading, filter, error } = useAppSelector((state) => state.tasks);

  // Estado local apenas para controlar a abertura do modal de criação
  // Estado que controla a abertura do modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carrega as tarefas do Firestore na montagem do componente
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Configuração das Abas de Filtro
  const tabs: { id: TaskStatus | "all"; name: string; icon: string }[] = [
    { id: "all", name: "Todas", icon: "📋" },
    { id: "stopped", name: "Paradas", icon: "🔴" },
    { id: "progress", name: "Em Andamento", icon: "⚡" },
    { id: "done", name: "Concluídas", icon: "✅" },
  ];

  return (
    <div className="my-15 space-y-6">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-50">
            Minhas Tarefas
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gerencie, filtre e monitore suas demandas diárias em tempo real.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 text-slate-50 text-sm font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-600/10 self-start sm:self-center"
        >
          + Nova Tarefa
        </button>
      </div>

      {/* NOTIFICAÇÃO DE ERRO */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {/* ABAS DE FILTRAGEM (TABS) */}
      <div className="border-b border-slate-900 flex gap-2">
        {tabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => dispatch(setFilter(tab.id as TaskStatus | "all"))}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 -mb-0.5] ${
                isActive
                  ? "border-orange-600 text-orange-500 font-semibold bg-orange-600/5 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* LISTAGEM DE TAREFAS / GRID CONTÊINER */}
      {isLoading ? (
        // 1. SKELETON SCREEN (Estado de Carregamento Fluido)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 animate-pulse"
            >
              <div className="h-5 bg-slate-800 rounded-full w-24"></div>
              <div className="space-y-2">
                <div className="h-5 bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
              </div>
              <div className="h-10 bg-slate-800 rounded-lg w-full mt-4"></div>
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        // 2. EMPTY STATE (Nenhuma tarefa encontrada)
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
          <span className="text-4xl mb-3">📁</span>
          <h3 className="text-slate-300 font-semibold text-lg">
            Nenhuma tarefa por aqui
          </h3>
          <p className="text-slate-500 text-sm max-w-sm mt-1">
            Parece que você não possui demandas{" "}
            {filter !== "all"
              ? `com o status "${tabs.find((t) => t.id === filter)?.name}"`
              : ""}{" "}
            cadastradas no momento.
          </p>
        </div>
      ) : (
        // 3. RENDERIZAÇÃO DA LISTA REAL
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-xl hover:border-slate-700/60 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Badge de Status Dinâmico */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                      task.status === "done"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : task.status === "progress"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {task.status === "done"
                      ? "Concluída"
                      : task.status === "progress"
                        ? "Em Andamento"
                        : "Parada"}
                  </span>

                  {/* Botão Deletar Invisível por padrão (Aparece no Hover do Card) */}
                  <button
                    onClick={() => dispatch(deleteTask(task.id))}
                    className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors md:opacity-0 group-hover:opacity-100"
                    title="Excluir tarefa"
                  >
                    🗑️
                  </button>
                </div>

                {/* Títulos e Descrição */}
                <h3
                  className={`text-slate-50 text-lg font-semibold tracking-tight ${task.status === "done" ? "line-through text-slate-500" : ""}`}
                >
                  {task.title}
                </h3>
                <p
                  className={`text-slate-400 text-sm mt-1.5 leading-relaxed ${task.status === "done" ? "text-slate-600" : ""}`}
                >
                  {task.description}
                </p>
              </div>

              {/* Botão de Ação Inferior */}
              <button
                onClick={() =>
                  dispatch(
                    toggleTaskStatus({
                      taskId: task.id,
                      currentStatus: task.status,
                    }),
                  )
                }
                className={`mt-5 w-full text-sm py-2 rounded-lg font-semibold transition-colors ${
                  task.status === "done"
                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700/80 hover:text-slate-200"
                    : "bg-orange-600 text-slate-50 hover:bg-orange-500 shadow-md shadow-orange-600/5"
                }`}
              >
                {task.status === "done" ? "Refazer Tarefa" : "Concluir Tarefa"}
              </button>
            </div>
          ))}
        </div>
      )}
      {/* 🚀 INJETE O MODAL AQUI NO FINAL DO JSX */}
      <TaskForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
