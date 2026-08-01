import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
// Redux Provider
import StoreProvider from "../store/provider";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  variable: "--font--poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlazeTrack -  Gestão Inteligente",
  description: "Gerenciador de tarefas de alta performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster 
          position="top-center"
          reverseOrder={true}
        />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
