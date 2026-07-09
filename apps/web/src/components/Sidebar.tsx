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

      {/* Mobile — barra superior */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
            A
          </div>
          <span className="font-semibold tracking-tight">Atlas</span>
        </div>
        <nav className="flex gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-500",
                ].join(" ")
              }
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
    </>
  );
}
