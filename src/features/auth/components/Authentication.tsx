"use client";
// components
import Loading from "../../../components/ui/Loading/Loading";
// useRouter from next/navigation
import { useRouter } from "next/navigation";
// react hooks and state management
import { useState, useEffect } from "react";
// components
import Alert from "@/src/components/ui/Alert/Alert";
import toast from "react-hot-toast";
// react-hook-form and zod
// React-hook-form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Redux
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
// Redux actions
import {
  loginWithEmail,
  registerUser,
  loginWithGoogle,
  loginWithGithub,
  clearError,
} from "../authSlice";
// Types
import {
  loginSchema,
  registerSchema,
  LoginCredentials,
  RegisterCredentials,
} from "../types";

export default function Authentication() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector((state) => state.auth);

  // 🚀 Monitora o estado de autenticação global do Redux
  useEffect(() => {
    if (user) {
      // Se o usuário existir no estado global (login efetuado), manda ele direto para o dashboard
      router.push("/dashboard");
    }
  }, [user, router]);

  // Alterna o esquema do Zod dependendo do modo atual da tela
  const currentSchema = isLoginMode ? loginSchema : registerSchema;

  type AuthFormValues = {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(currentSchema),
    mode: "onChange",
  });

  // Limpa erros residuais do Redux ao alternar entre login e cadastro
  useEffect(() => {
    dispatch(clearError());
    reset();
  }, [isLoginMode, dispatch, reset]);

  // Submit unificado do formulário manual
  const onSubmit = (data: LoginCredentials | RegisterCredentials) => {
    if (isLoginMode) {
      dispatch(loginWithEmail(data as LoginCredentials));
    } else {
      dispatch(registerUser(data as RegisterCredentials));
    }

    if(user) {
      toast.custom((t) => (
        <Alert
          msg="user was authenticated successfully!"
          type="success"
          toastId={t.id}
        />
      ));
    } else {
      toast.custom((t) => (
        <Alert
          msg={
            typeof error === "string"
              ? error
              : "Oops! Something went terribly wrong."
          }
          type="error"
          toastId={t.id}
        />
      ));
    }
  };

  return (
    <div className="mt-34 min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        {/* Header da Seção */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-50">
            {isLoginMode ? "Entrar no BlazeTrack" : "Criar sua conta"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isLoginMode
              ? "Gerencie suas tarefas com velocidade"
              : "Comece a rastrear seus projetos hoje"}
          </p>
        </div>

        {/* Aciona o componente de Loading durante o processo de autenticação */}
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-full bg-slate-900/10 border p-3 text-center">
            <Loading isLoading={isLoading} />
          </div>
        )}

        {/* Notificação de Erros do Firebase/Redux */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Formulário Principal */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full bg-slate-950 border border-slate-800 text-slate-50 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message?.toString()}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              E-mail
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full bg-slate-950 border border-slate-800 text-slate-50 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Senha
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full bg-slate-950 border border-slate-800 text-slate-50 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message?.toString()}
              </p>
            )}
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full bg-slate-950 border border-slate-800 text-slate-50 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword.message?.toString()}
                </p>
              )}
            </div>
          )}

          {/* Botão de Envio Manual */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-orange-600 text-slate-50 py-2.5 rounded-lg font-semibold hover:bg-orange-500 disabled:bg-orange-800 disabled:cursor-not-allowed transition-colors shadow-lg shadow-orange-600/10"
          >
            {isLoading
              ? "Processando..."
              : isLoginMode
                ? "Acessar Painel"
                : "Cadastrar"}
          </button>
        </form>

        {/* Divisor Visual */}
        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-slate-800"></div>
          <span className="shrink mx-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Ou continue com
          </span>
          <div className="grow border-t border-slate-800"></div>
        </div>

        {/* Botões de Autenticação Social */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => dispatch(loginWithGoogle())}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 text-slate-200 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="20"
              height="20"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
              ></path>
              <path
                fill="#FF3D00"
                d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691"
              ></path>
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
              ></path>
            </svg>
            Google
          </button>
          <button
            onClick={() => dispatch(loginWithGithub())}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 text-slate-200 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                fill="#fff"
              ></path>
            </svg>
            GitHub
          </button>
        </div>

        {/* Botão de Alternância de Modo */}
        <div className="text-center pt-2">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-sm text-slate-400 hover:text-orange-500 transition-colors"
          >
            {isLoginMode
              ? "Não possui uma conta? Cadastre-se"
              : "Já tem uma conta? Faça login"}
          </button>
        </div>
      </div>
    </div>
  );
}
