import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) { 
    // Bloquear acesso a /admin sem cookie de autenticação

    // 1. Recupera o token/cookie de sessão do usuário
    const sessionToken = request.cookies.get('blazetrack_session')?.value;

    // 2. Captura a rota que o usuário está tentando acessar
    const { pathname } = request.nextUrl;

    // Definimos quais são as rotas que exigem autenticação ativa
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/tasks');

    // Definimos quais rotas são de autenticação (públicas)
    const isAuthRoute = pathname.startsWith('/login');

    // 🚪 CASO 1: Usuário NÃO está logado e tenta acessar uma rota protegida
    if (!sessionToken && isProtectedRoute) {
        // Redireciona o usuário para a tela de login
        const loginUrl = new URL('/authentication/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 🛑 CASO 2: Usuário JÁ está logado e tenta forçar a entrada na tela de login
    if (sessionToken && isAuthRoute) {
        // Redireciona ele direto de volta para o painel privado
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    // Se estiver tudo correto, permite que a requisição continue normalmente
    return NextResponse.next();
}

// 🎯 CONFIGURAÇÃO DO MATCHER (Essencial para Performance)
// O middleware/proxy só será executado nas rotas listadas abaixo, ignorando arquivos estáticos do Next.js
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/tasks/:path*',
        '/login'
    ],
};