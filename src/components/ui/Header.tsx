"use client";
import Link from "next/link";
import { useState } from "react";

// import image from next.js
import Image from "next/image";

// images
import logoImage from "../../assets/logo/BlazeTrack logomarca.png";

// Redux
import { useAppSelector } from "../../store/hooks";

export default function Header() {
  const { user } = useAppSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { name: "Products", href: "#" },
    { name: "Services", href: "#features" },
    { name: "Apps", href: "#" },
    { name: "Pricing", href: "#price" },
    { name: "About", href: "#" },
    {
      name: !!user ? "Profile" : "Login",
      href: !!user ? "/dashboard" : "/login",
    },
    { name: "Painel Administrativo", href: "/dashboard" },
  ];

  return (
    <>
      <nav className="fixed z-20 top-0 left-0 w-full backdrop-blur-lg bg-white/190 border-b border-zinc-200 px-6 md:px-12 lg:px-24 xl:px-40 py-4 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logoImage}
            alt="imagem da Logomarca da BlazeTrack"
            className="h-21 w-auto object-contain rounded-full"
          />
        </Link>

        <div className="hidden md:flex items-center bg-zinc-50/190 border border-zinc-200 rounded-full px-2 py-1 gap-2 shadow-sm">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2 rounded-full text-sm transition duration-200 ${item.name === "Products" ? "bg-white border border-zinc-200 font-medium text-zinc-900 shadow-sm" : "text-zinc-200 hover:text-zinc-900 hover:bg-white"}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button className="hidden md-inline-flex items-center gap-2 bg-linear-to-r from-zinc-950 via-zinc-700 to-zinc-500 text-white text-sm font-medium px-5 py-2 rounded-full shadow-lg transition hover:brightness-110">
          {!!user ? `Olá! ${user.email}` : "Get started"}
          <span className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-zinc-950">
            <svg
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.6 4.602h10m-4-4 4 4-4 4"
                stroke="#3f3f47"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1"
          aria-label="Abrir menu"
        >
          <span
            className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-zinc-800 transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          ></span>
        </button>

        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white-500/190 backdrop-blur-lg border-t border-zinc-200 shadow-xl flex flex-col p-5 gap-3 md:hidden z-50">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-4 py-3 rounded-2xl text-sm transition ${item.name === "Products" ? "bg-zinc-50 font-medium text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"}`}
              >
                {item.name}
              </a>
            ))}
            <button className="flex items-center justify-center gap-2 bg-linear-to-r from-zinc-950 via-zinc-700 to-zinc-500 text-white text-sm font-medium px-5 py-3 rounded-full transition hover:brightness-110 w-fit">
              Get started
              <span className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-zinc-950">
                <svg
                  width="12"
                  height="10"
                  viewBox="0 0 12 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M.6 4.602h10m-4-4 4 4-4 4"
                    stroke="#3f3f47"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
