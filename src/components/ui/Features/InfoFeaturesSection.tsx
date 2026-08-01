import {
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import DesignLabDashboard from "../ControlPainel";

type FeatureItem = {
  title: string;
  description: string;
  icon: ReactNode;
  accent: string;
  glow: string;
};

type FeatureCardProps = {
  feature: FeatureItem;
};

const features: FeatureItem[] = [
  {
    title: "Real-Time Analytics",
    description:
      "Get instant insights into your finances with live dashboards that adapt to every move.",
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
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    accent: "bg-violet-500/15 text-violet-300",
    glow: "bg-gradient-to-br from-amber-400/80 via-orange-500/70 to-fuchsia-500/70",
  },
  {
    title: "Bank-Grade Security",
    description:
      "Protect every transaction with end-to-end encryption, 2FA, and compliance-driven safeguards.",
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
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.832 22.75C6.415 21 6.999 17.5 6.999 14a7 7 0 0 1 .396-2.333m2.695 13.999c.245-.77.525-1.54.665-2.333m-.255-15.4A7 7 0 0 1 21 14v2.333"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    accent: "bg-emerald-500/15 text-emerald-300",
    glow: "bg-gradient-to-br from-emerald-400/80 via-cyan-400/70 to-blue-500/70",
  },
  {
    title: "Customizable Reports",
    description:
      "Export professional, audit-ready reports for tax season, reviews, or strategic planning.",
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
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.332 2.333V7a2.334 2.334 0 0 0 2.333 2.333h4.667m-21 8.167h11.667M10.5 21l3.5-3.5-3.5-3.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    accent: "bg-orange-500/15 text-orange-300",
    glow: "bg-gradient-to-br from-fuchsia-400/80 via-orange-400/70 to-amber-500/70",
  },
];

function FeatureCard({ feature }: FeatureCardProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const bounds = cardRef.current?.getBoundingClientRect();

    if (!bounds) return;

    setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_rgba(15,23,42,0.45)]"
    >
      {visible && (
        <div
          className={`pointer-events-none absolute z-0 size-56 rounded-full blur-3xl opacity-80 transition-opacity duration-300 ${feature.glow}`}
          style={{ top: position.y - 112, left: position.x - 112 }}
        />
      )}
      <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${feature.accent}`}
        >
          {feature.icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-100">
            {feature.title}
          </h3>
          <p className="text-sm leading-6 text-slate-300">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InfoFeaturesSection() {
  return (
    <section className="mx-auto my-16 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
        <div className="w-full lg:w-[55%]">
          <DesignLabDashboard />
        </div>

        <div className="w-full lg:w-[45%]">
          <div className="mb-8 max-w-xl text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-violet-300">
              Ferramentas completas
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Mais controle, menos esforço
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              Organize sua rotina financeira com recursos pensados para destacar
              o que importa e transformar dados em decisões rápidas.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
