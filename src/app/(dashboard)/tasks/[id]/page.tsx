"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchTasks,
  toggleTaskStatus,
} from "../../../../features/tasks/tasksSlice";
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from "../../../../config/firebase";
import { ITask, IComment } from "../../../../features/tasks/types";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [task, setTask] = useState<ITask | null>(null);
  const [commentText, setCommentText] = useState("");

  // Estados do Pomodoro
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(1500); // 25 minutos padrão

  // Escuta em tempo real o Firestore (essencial para comentários colaborativos)
  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "tasks", id as string);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        // Bloqueia se a tarefa for privada e o usuário não for o dono
        if (!data.isPublic && user && data.userId !== user.uid) {
          router.push("/dashboard");
          return;
        }
        setTask({ id: snapshot.id, ...data } as ITask);
      }
    });
    return () => unsubscribe();
  }, [id, user, router]);

  // Lógica do Cronômetro Pomodoro
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && seconds > 0) {
      interval = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    } else if (seconds === 0 && isTimerActive) {
      setIsTimerActive(false);
      alert("⏱️ Bloco Pomodoro concluído! Hora de descansar.");
      // Aqui salvaríamos o pomodoroTimeSpent acumulado no Firestore
    }
    return () => clearInterval(interval);
  }, [isTimerActive, seconds]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("🔗 Link de compartilhamento copiado!");
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user || !id) return;

    const newComment: IComment = {
      id: Math.random().toString(36).substring(2),
      userId: user.uid,
      userName: user.displayName,
      userPhoto: user.photoURL || "",
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    const docRef = doc(db, "tasks", id as string);
    await updateDoc(docRef, {
      comments: arrayUnion(newComment),
    });
    setCommentText("");
  };

  if (!task)
    return (
      <div className="p-8 text-center text-slate-400">
        Carregando detalhes da demanda...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* HEADER DA TAREFA */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${task.isPublic ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800 text-slate-400"}`}
            >
              {task.isPublic ? "🌍 Pública" : "🔒 Privada"}
            </span>
            {task.deadline && (
              <span className="text-xs bg-red-500/10 text-red-400 px-2.5 py-0.5 rounded-full font-medium">
                📅 Prazo: {new Date(task.deadline).toLocaleDateString("pt-BR")}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-50">{task.title}</h1>
          <p className="text-slate-400 text-sm mt-1">{task.description}</p>
        </div>

        <button
          onClick={handleShare}
          className="bg-slate-950 border border-slate-800 hover:bg-slate-800 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          🔗 Compartilhar Link
        </button>
      </div>

      {/* BLOCO POMODORO */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Metodologia Pomodoro
        </h3>
        <div className="text-4xl font-mono font-bold text-orange-500">
          {Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}
          :{(seconds % 60).toString().padStart(2, "0")}
        </div>
        <button
          onClick={() => setIsTimerActive(!isTimerActive)}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${isTimerActive ? "bg-red-600 text-slate-50" : "bg-orange-600 text-slate-50"}`}
        >
          {isTimerActive ? "⏸️ Pausar" : "⚡ Iniciar Foco"}
        </button>
      </div>

      {/* FEED DE COMENTÁRIOS COLABORATIVOS */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">
          💬 Discussões e Andamento
        </h3>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {task.comments?.map((comment) => (
            <div
              key={comment.id}
              className="bg-slate-950 border border-slate-850 p-3 rounded-xl"
            >
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1">
                <span>{comment.userName}</span>
                <span className="text-slate-600">
                  {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p className="text-sm text-slate-200">{comment.text}</p>
            </div>
          ))}
        </div>

        {user && (
          <form
            onSubmit={handleAddComment}
            className="flex gap-2 pt-2 border-t border-slate-800"
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Notifique o andamento ou comente algo..."
              className="flex-1 bg-slate-950 border border-slate-800 text-slate-50 text-sm px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-500 text-sm font-semibold px-4 rounded-xl transition-colors"
            >
              Enviar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
