// ⚠️ Mantemos este arquivo sem "use client" para que seja um Server Component rápido e amigável para SEO.
import Authentication from "../../../../features/auth/components/Authentication";
import { Metadata } from "next";

// components
import Header from "@/src/components/ui/Header";
import Footer from "@/src/components/ui/Footer";

// Metadados dinâmicos que os recrutadores adoram ver estruturados corretamente
export const metadata: Metadata = {
  title: "Acessar Plataforma | BlazeTrack",
  description:
    "Faça login ou cadastre-se no BlazeTrack para gerenciar e monitorar suas tarefas em tempo real.",
};

export default function LoginPage() {
  return (
    <>
      {/* 
        Injetamos o componente encapsulado da feature. 
        Toda a lógica pesada de validação com Zod/React Hook Form e os dispatches do Redux 
        ficam isolados dentro dele, mantendo esta rota limpa e legível.
      */}
      <Header />
      <Authentication />
      <Footer />
    </>
  );
}
