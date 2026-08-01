"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PenTool,
  Image as ImageIcon,
  Globe,
  BookOpen,
  Mail,
} from "lucide-react";

// Tipagem para os itens do menu
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { id: "logo", label: "Design de logotipo", icon: <PenTool size={18} /> },
  { id: "banner", label: "Banner do Facebook", icon: <ImageIcon size={18} /> },
  { id: "home", label: "Página inicial", icon: <Globe size={18} /> },
  { id: "brand", label: "Diretrizes da marca", icon: <BookOpen size={18} /> },
  { id: "email", label: "E-mail", icon: <Mail size={18} /> },
];

const DesignLabDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("logo");

  return (
    <div className="relative flex items-center justify-center w-full min-h-125 bg-[#050505] p-8 overflow-hidden rounded-sm">
      {/* Efeito de Glow de Fundo (uid 2819) */}
      <div className="absolute -top-25 -left-12.5 w-100 h-100 bg-white/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Container Principal (#dashboard) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-185 h-82.5 bg-[#1a1a1a]/40 backdrop-blur-xl border border-white/10 rounded-[20px] p-6 flex flex-col gap-6 overflow-hidden shadow-2xl"
      >
        {/* Botões de Navegador (uid 2816) */}
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
        </div>

        {/* Barra de Status (uid 2817) */}
        <div className="flex gap-4 w-full">
          <StatusCard label="Pendência" color="#007AFF" active />
          <StatusCard label="Em andamento" color="#FFAE00" />
          <StatusCard label="Aprovado" color="#00FF15" />
        </div>

        {/* Menu Lateral e Conteúdo (uid 2818) */}
        <div className="flex flex-col gap-2 w-70">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors duration-200 ${
                activeTab === item.id
                  ? "text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background Ativo com LayoutId para animação fluida */}
              {activeTab === item.id && (
                <motion.div
                  layoutId="active-bg"
                  className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent border border-white/10 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10 font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Sub-componente para os cards de status
const StatusCard = ({
  label,
  color,
  active = false,
}: {
  label: string;
  color: string;
  active?: boolean;
}) => (
  <div
    className={`flex-1 relative h-10 rounded-md border flex items-center px-4 overflow-hidden group cursor-pointer transition ${
      active ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5"
    }`}
  >
    {/* Linha colorida lateral */}
    <div
      className="absolute left-0 top-0 bottom-0 w-0.75"
      style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
    />
    <span
      className={`text-[12px] font-medium ${active ? "text-white" : "text-white/80"}`}
    >
      {label}
    </span>

    {/* Efeito de brilho interno no hover */}
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

export default DesignLabDashboard;
