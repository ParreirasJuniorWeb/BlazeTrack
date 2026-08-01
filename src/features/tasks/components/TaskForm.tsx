"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addTask } from "../tasksSlice";
import { taskFormSchema, TaskFormData } from "../types";
import toast from "react-hot-toast";
import Alert from "@/src/components/ui/Alert/Alert";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskForm({ isOpen, onClose }: TaskFormProps) {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector((state) => state.tasks);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: false,
      deadline: "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: TaskFormData) => {
    // Tratamento para garantir que strings vazias de data sejam enviadas como null para o Firestore
    const formattedData = {
      ...data,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      pomodoroTimeSpent: 0,
      comments: [],
    };

    const resultAction = await dispatch(addTask(formattedData as any));

    if (addTask.fulfilled.match(resultAction)) {
      reset();
      onClose();
      toast.custom((t) => (
        <Alert
          msg="Task was created successfully!"
          type="success"
          toastId={t.id}
        />
      ));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop de fundo escuro com efeito blur */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Caixa de Diálogo do Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xl font-bold text-slate-50 flex items-center gap-2">
            <span>📝</span> Criar Nova Tarefa
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Notificação de Erros de Conexão */}
        {error && (
          <div className="overflow-hidden bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-wrap">
            ❌ Erro de Gravação: {error}
          </div>
        )}

        {/* Formulário Operacional */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo: Título */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Título da Demanda
            </label>
            <input
              type="text"
              {...register("title")}
              disabled={isSubmitting}
              className="w-full bg-slate-950 border border-slate-800 text-slate-50 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all disabled:opacity-50"
              placeholder="Ex: Refatorar contexto de autenticação"
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Descrição / Escopo
            </label>
            <textarea
              {...register("description")}
              disabled={isSubmitting}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 text-slate-50 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all resize-none disabled:opacity-50"
              placeholder="Descreva detalhadamente o que deve ser feito nesta tarefa..."
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Campo: Data Limite (Deadline) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Prazo de Entrega (Deadline)
            </label>
            <input
              type="date"
              {...register("deadline")}
              disabled={isSubmitting}
              className="w-full bg-slate-950 border border-slate-800 text-slate-50 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all disabled:opacity-50 color-scheme-dark"
              style={{ colorScheme: "dark" }} // Força o calendário nativo do navegador a renderizar em Dark Mode
            />
            {errors.deadline && (
              <p className="text-red-400 text-xs mt-1">
                {errors.deadline.message}
              </p>
            )}
          </div>

          {/* Campo: Interruptor de Visibilidade (isPublic) */}
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-200 block">
                Tornar Tarefa Pública
              </label>
              <span className="text-[11px] text-slate-500 block leading-tight">
                Permite que todos os membros autenticados visualizem, comentem e
                gerenciem esta demanda no Kanban.
              </span>
            </div>

            {/* Custom Checkbox estilizado como Switch Coesivo */}
            <div className="relative flex items-center h-6 mt-1">
              <input
                id="isPublic"
                type="checkbox"
                {...register("isPublic")}
                disabled={isSubmitting}
                className="w-9 h-5 bg-slate-800 checked:bg-orange-600 rounded-full appearance-none cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-slate-400 checked:before:bg-slate-50 before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-4 before:transition-all duration-200 outline-none focus:ring-2 focus:ring-orange-600/50"
              />
            </div>
          </div>

          {/* Rodapé e Botões de Gatilho */}
          <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-500 text-slate-50 text-sm font-semibold py-2 px-5 rounded-xl transition-colors shadow-lg shadow-orange-600/10 flex items-center gap-2 disabled:bg-orange-800 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Cadastrando..." : "Adicionar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
