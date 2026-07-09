import type { CheckKey, CheckType, CheckStatus } from "@atlas/shared";
import { useWizard } from "../../../store/wizard.js";

interface Props {
  type: CheckType;
  checkKey: CheckKey;
  title: string;
  hint?: string;
  okLabel?: string;
  failLabel?: string;
}

export function CheckRow({
  type,
  checkKey,
  title,
  hint,
  okLabel = "Tudo certo",
  failLabel = "Tem problema",
}: Props) {
  const current = useWizard((s) => s.checks.find((c) => c.key === checkKey));
  const setCheck = useWizard((s) => s.setCheck);

  const choose = (status: CheckStatus) =>
    setCheck(type, checkKey, status, current?.note);

  return (
    <div className="flex flex-col gap-2 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-700">{title}</p>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => choose("ok")}
          className={[
            "rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition",
            current?.status === "ok"
              ? "bg-emerald-500 text-white ring-emerald-500"
              : "bg-white text-slate-500 ring-slate-200 hover:bg-slate-50",
          ].join(" ")}
        >
          {okLabel}
        </button>
        <button
          type="button"
          onClick={() => choose("fail")}
          className={[
            "rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition",
            current?.status === "fail"
              ? "bg-red-500 text-white ring-red-500"
              : "bg-white text-slate-500 ring-slate-200 hover:bg-slate-50",
          ].join(" ")}
        >
          {failLabel}
        </button>
      </div>
    </div>
  );
}
