"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  deleteTask,
  fetchTasks,
  selectTaskMetrics,
} from "../../../features/tasks/tasksSlice";
import { taskService } from "../../../features/tasks/services/taskService";
import { TaskStatus, ITask } from "../../../features/tasks/types";
import Link from "next/link";

function DashboardWithKanban() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);
  const { isLoading } = useAppSelector((state) => state.tasks);

  // 🔐 CAPTURA O USUÁRIO AUTENTICADO DO REDUX
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Colunas do Kanban estilo Monday.com
  const columns: {
    id: TaskStatus;
    title: string;
    color: string;
    bg: string;
  }[] = [
    {
      id: "stopped",
      title: "🔴 Parado",
      color: "text-red-400",
      bg: "border-red-900/30 bg-red-500/5",
    },
    {
      id: "progress",
      title: "⚡ Em Andamento",
      color: "text-amber-500",
      bg: "border-amber-900/30 bg-amber-500/5",
    },
    {
      id: "done",
      title: "✅ Feito",
      color: "text-emerald-500",
      bg: "border-emerald-900/30 bg-emerald-500/5",
    },
  ];

  // Move a tarefa mudando o status diretamente no Firestore e atualizando a UI
  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    await taskService.updateTask(taskId, { status: newStatus });
    // Força a atualização local despachando o fetch novamente ou disparando uma action dedicada
    dispatch(fetchTasks());
  };

  return (
    <div className="space-y-8">
      {/* ... Mantenha o Grid de Cards de Métricas do Passo Anterior aqui ... */}

      {/* QUADRO KANBAN ESTILO MONDAY.COM */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>📋</span> Quadro Operacional Kanban
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerencie os fluxos mudando o status das demandas da equipe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((col) => {
            const columnTasks = tasks.filter(
              (t: ITask) =>
                t.status === col.id || (!t.status && col.id === "stopped"),
            ); // Fallback de status

            return (
              <div
                key={col.id}
                className={`border p-4 rounded-2xl flex flex-col space-y-3 ${col.bg}`}
              >
                {/* Header da Coluna */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className={`font-bold text-sm ${col.color}`}>
                    {col.title}
                  </span>
                  <span className="text-xs bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full font-medium text-slate-400">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Lista de Tasks Internas */}
                <div className="space-y-3 flex-1 overflow-y-auto min-h-62.5">
                  {columnTasks.map((task: ITask) => {
                    // 🛡️ REGRA DE OURO DA TRAVA DE SEGURANÇA VISUAL
                    // Retorna true se a tarefa pertencer estritamente ao usuário que está logado na sessão
                    const isOwner = currentUser?.uid === task.userId;

                    return (
                      <div
                        key={task.id}
                        className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg hover:border-slate-700 transition-all space-y-3"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-bold text-slate-200 tracking-tight leading-tight">
                              {task.title}
                            </h4>
                            {task.isPublic && (
                              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.2 rounded font-bold shrink-0">
                                🌍
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        </div>

                        {/* Controles de Mudança de Baia Rápida */}
                        <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
                          <Link
                            href={`/tasks/${task.id}`}
                            className="text-[11px] text-orange-500 hover:underline font-medium"
                          >
                            Ver Detalhes →
                          </Link>

                          <div className="flex gap-1 items-center">
                            {/* 🚨 BOTÃO DELETAR PROTEGIDO NATIVAMENTE */}
                            {isOwner ? (
                              <button
                                onClick={() => dispatch(deleteTask(task.id))}
                                className="text-xs text-slate-500 hover:text-red-400 p-1 mr-1 rounded transition-colors opacity-100 lg:opacity-0 group-hover:opacity-100"
                                title="Excluir minha tarefa"
                              >
                                🗑️
                              </button>
                            ) : (
                              // Se não for o dono, renderiza um indicador visual discreto de cadeado
                              <span
                                className="text-xs text-slate-600 p-1 mr-1 select-none"
                                title="Esta tarefa pertence a outro membro da equipe"
                              >
                                🔒
                              </span>
                            )}

                            {/* Controles de Movimentação do Kanban */}
                            {columns
                              .filter((c) => c.id !== task.status)
                              .map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => moveTask(task.id, c.id)}
                                  className="text-[10px] bg-slate-950 border border-slate-800 hover:border-slate-700 px-1.5 py-0.5 rounded text-slate-400 transition-colors"
                                  title={`Mover para ${c.title}`}
                                >
                                  {c.id === "stopped"
                                    ? "🔴"
                                    : c.id === "progress"
                                      ? "⚡"
                                      : "✅"}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {!isLoading && columnTasks.length === 0 && (
                    <p className="text-center text-xs text-slate-600 py-8 italic">
                      Sem tarefas nesta baia
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { isLoading } = useAppSelector((state) => state.tasks);

  // Consome as métricas calculadas pelo seletor otimizado
  const { total, completed, pending, completionRate } =
    useAppSelector(selectTaskMetrics);

  // Garante que os dados estejam atualizados ao entrar na tela
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* SEÇÃO DE BOAS-VINDAS */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-50">
          Olá, {user?.displayName?.split(" ")[0] || "Desenvolvedor"}! 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Aqui está o panorama de performance e monitoramento do seu fluxo de
          trabalho.
        </p>
      </div>

      {/* GRID DE CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CARD 1: TOTAL */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700/80 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total de Demandas
              </p>
              <h3 className="text-3xl font-bold text-slate-50 mt-2">
                {isLoading ? "..." : total}
              </h3>
            </div>
            <span className="text-2xl bg-slate-950 p-2 rounded-xl border border-slate-800">
              📋
            </span>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-0.75 bg-slate-800 group-hover:bg-slate-700 transition-colors" />
        </div>

        {/* CARD 2: PENDENTES */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700/80 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Em Andamento
              </p>
              <h3 className="text-3xl font-bold text-amber-500 mt-2">
                {isLoading ? "..." : pending}
              </h3>
            </div>
            <span className="text-2xl bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
              ⚡
            </span>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-0.75 bg-amber-500/20" />
        </div>

        {/* CARD 3: CONCLUÍDAS */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700/80 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Concluídas
              </p>
              <h3 className="text-3xl font-bold text-emerald-500 mt-2">
                {isLoading ? "..." : completed}
              </h3>
            </div>
            <span className="text-2xl bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
              ✅
            </span>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-0.75 bg-emerald-500/20" />
        </div>

        {/* CARD 4: TAXA DE PERFORMANCE */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700/80 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Taxa de Conclusão
              </p>
              <h3 className="text-3xl font-bold text-orange-500 mt-2">
                {isLoading ? "..." : `${completionRate}%`}
              </h3>
            </div>
            <span className="text-2xl bg-orange-500/10 p-2 rounded-xl border border-orange-500/20">
              📈
            </span>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-0.75 bg-orange-500/20" />
        </div>
      </div>

      {/* SEÇÃO DO GRÁFICO VISUAL DE PROGRESSO PROPORCIONAL */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Progresso Geral</h3>
          <p className="text-slate-400 text-xs">
            Visualização gráfica da proporção de tarefas finalizadas.
          </p>
        </div>

        {/* Barra de Progresso Estilizada */}
        <div className="space-y-2">
          <div className="w-full bg-slate-950 rounded-full h-4 border border-slate-800 overflow-hidden p-0.5">
            <div
              className="bg-linear-to-r from-orange-600 to-amber-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-medium px-1">
            <span>0% das tarefas</span>
            <span className="text-orange-500 font-semibold">
              {completionRate}% Concluído
            </span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <DashboardWithKanban />

      {/* FOOTER CALL-TO-ACTION (Ações Rápidas) */}
      <div className="bg-linear-to-r from-slate-900 to-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h4 className="text-slate-200 font-bold">
            Precisa atualizar ou organizar suas demandas?
          </h4>
          <p className="text-slate-400 text-xs mt-0.5">
            Acesse o quadro operacional do BlazeTrack para gerenciar os blocos
            de tarefas.
          </p>
        </div>
        <Link
          href="/tasks"
          className="bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold py-2 px-5 rounded-xl transition-all"
        >
          Ir para Quadro de Tarefas →
        </Link>
      </div>
    </div>
  );
}
