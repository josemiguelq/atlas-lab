import { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV = [
  { to: "/", label: "Início", icon: "🏠" },
  { to: "/os/new", label: "Nova OS", icon: "🧾" },
];

const BANCADA = [
  { to: "/bancada/analise", label: "Análise", icon: "🔧" },
];

const FUTURE = [
  { label: "Clientes (ERP)", icon: "👥" },
  { label: "Financeiro", icon: "💰" },
  { label: "Tutoriais", icon: "🎓" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50",
  ].join(" ");

export function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop — sidebar vertical */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            A
          </div>
          <span className="text-lg font-semibold tracking-tight">Atlas</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Bancada
          </p>
          {BANCADA.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Em breve
          </p>
          {FUTURE.map((item) => (
            <div
              key={item.label}
              className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300"
            >
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="px-6 py-4 text-[11px] text-slate-400">
          Etapa 1 • sem login • foco iPhone
        </div>
      </aside>

      {/* Mobile — hamburger */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
          aria-label="Abrir menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
            A
          </div>
          <span className="font-semibold tracking-tight">Atlas</span>
        </div>

        <div className="w-9" />
      </header>

      {/* Overlay + drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col border-r border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
                  A
                </div>
                <span className="font-semibold tracking-tight">Atlas</span>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                aria-label="Fechar menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-3">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}

              <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Bancada
              </p>
              {BANCADA.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}

              <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Em breve
              </p>
              {FUTURE.map((item) => (
                <div
                  key={item.label}
                  className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </nav>

            <div className="px-6 py-4 text-[11px] text-slate-400">
              Etapa 1 • sem login • foco iPhone
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
