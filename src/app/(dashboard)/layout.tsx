"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../features/auth/authSlice";
import Cookies from "js-cookie";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const router = useRouter();

  const handleLogout = () => {
    // Remove o cookie que o middleware valida e limpa o estado do Redux
    Cookies.remove("blazetrack_session");
    dispatch(logout());
    router.push("/authentication/login");
  };

  // Itens de navegação da Sidebar
  const navigation = [
    { name: "Visão Geral", href: "/dashboard", icon: "📊" },
    { name: "Minhas Tarefas", href: "/tasks", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* 1. SIDEBAR PARA DESKTOP (Fixo na esquerda) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-slate-900 border-r border-slate-800 z-30">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo do Sistema */}
          <div className="flex items-center h-16 shrink-0 px-6 border-b border-slate-800">
            <span className="text-xl font-extrabold tracking-wider bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              BlazeTrack
            </span>
          </div>

          {/* Links de Navegação */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-orange-600 text-slate-50 shadow-lg shadow-orange-600/10"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Rodapé da Sidebar (Dados do Usuário e Logout) */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="w-9 h-9 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-500 shrink-0">
                  {user?.displayName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="ml-3 truncate">
                  <p className="text-sm font-semibold text-slate-200 truncate">
                    {user?.displayName || "Usuário"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                title="Sair do sistema"
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. SIDEBAR MOBILE (Backdrop + Menu Gaveta) */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop Escuro com efeito Blur */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="relative flex flex-col flex-1 w-full max-w-xs bg-slate-900 border-r border-slate-800 animate-slide-in">
            <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
              <span className="text-xl font-extrabold bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                BlazeTrack
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xl"
              >
                ✕
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      isActive
                        ? "bg-orange-600 text-slate-50"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border border-slate-800 rounded-xl text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-colors"
              >
                <span>🚪</span> Sair da Conta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTEÚDO PRINCIPAL (Header + Páginas Privadas) */}
      <div className="flex flex-col flex-1 md:pl-64">
        {/* HEADER FIXO */}
        <header className="sticky top-0 z-20 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Botão de Menu Hambúrguer (Apenas Mobile) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-slate-200 focus:outline-none"
          >
            ☰
          </button>

          {/* Título Dinâmico ou Indicador de Localização */}
          <div className="text-sm font-medium text-slate-400 hidden sm:block">
            Painel Geral &nbsp;/&nbsp;{" "}
            <span className="text-slate-200 capitalize">
              {pathname.replace("/", "")}
            </span>
          </div>

          {/* Ações do Canto Direito */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notificação/Badge de Status Simbólico */}
            <div className="hidden xs:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Firebase Conectado
            </div>

            {/* Perfil Compacto */}
            <div className="w-8 h-8 rounded-full bg-orange-600 text-slate-50 flex items-center justify-center text-sm font-semibold select-none">
              {user?.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* CONTAINER DA PÁGINA (Injeta o conteúdo das subrotas /dashboard e /tasks) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
