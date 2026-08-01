import React, { useState } from "react";

type ItemCardProps = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const cardItems: ItemCardProps[] = [
  {
    id: "analytics",
    title: "Real-Time Analytics",
    description:
      "Get instant insights into your finances with live dashboards.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 18.667V24.5m4.668-8.167V24.5m4.664-12.833V24.5m2.333-21L15.578 13.587a.584.584 0 0 1-.826 0l-3.84-3.84a.583.583 0 0 0-.825 0L2.332 17.5M4.668 21v3.5m4.664-8.167V24.5"
          stroke="#FF5A1F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "security",
    title: "Bank-Grade Security",
    description: "End-to-end encryption, 2FA, compliance with GDPR standards.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 11.667A2.333 2.333 0 0 0 11.667 14c0 1.19-.117 2.929-.304 4.667m4.972-3.36c0 2.776 0 7.443-1.167 10.36m5.004-1.144c.14-.7.502-2.683.583-3.523M2.332 14a11.667 11.667 0 0 1 21-7m-21 11.667h.01m23.092 0c.233-2.333.152-6.246 0-7"
          stroke="#FF5A1F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.832 22.75C6.415 21 6.999 17.5 6.999 14a7 7 0 0 1 .396-2.333m2.695 13.999c.245-.77.525-1.54.665-2.333m-.255-15.4A7 7 0 0 1 21 14v2.333"
          stroke="#FF5A1F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "reports",
    title: "Customizable Reports",
    description:
      "Export professional, audit-ready financial reports for tax or internal review.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.668 25.666h16.333a2.333 2.333 0 0 0 2.334-2.333V8.166L17.5 2.333H7a2.333 2.333 0 0 0-2.333 2.333v4.667"
          stroke="#FF5A1F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.332 2.333V7a2.334 2.334 0 0 0 2.333 2.333h4.667m-21 8.167h11.667M10.5 21l3.5-3.5-3.5-3.5"
          stroke="#FF5A1F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function CardComponentFeaturesSection() {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleCardEnter = (cardId: string) => {
    setActiveCardId(cardId);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    cardId: string,
  ) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    setActiveCardId(cardId);
    setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  const handleCardLeave = () => {
    setActiveCardId(null);
  };

  return (
    <div className="my-10">
      <h1 className="text-3xl font-semibold text-center mx-auto">
        Powerful Features
      </h1>
      <p className="text-sm text-slate-300 text-center mt-2 max-w-md mx-auto">
        Everything you need to manage, track, and grow your finances, securely
        and efficiently.
      </p>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-2 mt-20 mx-auto md:grid-cols-2 xl:grid-cols-3">
        {cardItems.map((card) => {
          const cardId = `${card.id}-primary`;
          const isActive = activeCardId === cardId;
          const isDimmed = activeCardId !== null && !isActive;

          return (
            <div
              key={cardId}
              onMouseMove={(e) => handleMouseMove(e, cardId)}
              onMouseEnter={() => handleCardEnter(cardId)}
              onMouseLeave={handleCardLeave}
              className={`relative overflow-hidden rounded-[30px] bg-slate-900/190 p-px shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                isDimmed
                  ? "opacity-40 blur-[1px] saturate-50"
                  : "opacity-100 blur-0 saturate-100"
              } ${isActive ? "scale-[1.01]" : "scale-100"}`}
            >
              <div
                className={`pointer-events-none absolute h-72 w-72 rounded-full bg-linear-to-r from-amber-200 via-amber-500 to-orange-300 blur-3xl transition-opacity duration-500 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
                style={{ top: position.y - 120, left: position.x - 120 }}
              />
              <div
                className={`relative flex min-h-46 flex-col items-center justify-center gap-6 rounded-[28px] bg-amber-950/5 p-8 text-center text-slate-300 backdrop-blur-sm transition-all duration-300 ${
                  isActive
                    ? "border border-orange-200/80 shadow-[0_0_50px_rgba(255,136,0,0.12)]"
                    : "border border-transparent"
                }`}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
                  {card.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-slate-100">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-300">{card.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="my-6 py-4 px-14 not-only:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="size-130 top-0 left-1/2 -translate-x-1/2 rounded-full absolute blur-[300px] -z-10 bg-[#FBFFE1]/70"></div>
        {cardItems.map((card) => {
          const cardId = `${card.id}-secondary`;
          const isActive = activeCardId === cardId;
          const isDimmed = activeCardId !== null && !isActive;

          return (
            <div
              key={cardId}
              onMouseMove={(e) => handleMouseMove(e, cardId)}
              onMouseEnter={() => handleCardEnter(cardId)}
              onMouseLeave={handleCardLeave}
              className={`flex flex-col items-center justify-center max-w-80 rounded-3xl border p-4 transition-all duration-300 ${
                isDimmed
                  ? "opacity-40 blur-[1px] saturate-50"
                  : "opacity-100 blur-0 saturate-100"
              } ${
                isActive
                  ? "border-orange-200/70 bg-white/5 shadow-[0_0_30px_rgba(255,136,0,0.12)]"
                  : "border-transparent"
              }`}
            >
              <div className="p-6 aspect-square bg-amber-100 rounded-full">
                {card.icon}
              </div>
              <div className="mt-5 space-y-2 text-center">
                <h3 className="text-base font-semibold text-slate-200">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-200">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
