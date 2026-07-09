import { useState, useEffect } from "react";
import type { ItemKind, PaymentMethod } from "@atlas/shared";
import { useWizard } from "../../../store/wizard.js";
import { brl } from "../../../lib/format.js";

const PAYMENTS: { value: PaymentMethod; label: string }[] = [
  { value: "pix", label: "Pix" },
  { value: "cash", label: "Dinheiro" },
  { value: "credit", label: "Crédito" },
  { value: "debit", label: "Débito" },
  { value: "transfer", label: "Transferência" },
  { value: "other", label: "Outro" },
];

export function BudgetStep() {
  const { items, addItem, removeItem, budget, setBudget, budgetOnly, setBudgetOnly } = useWizard();
  const [kind, setKind] = useState<ItemKind>("service");
  const [desc, setDesc] = useState("");
  const [value, setValue] = useState("");
  const [itemsOpen, setItemsOpen] = useState(false);

  const itemsTotal = items.reduce((sum, i) => sum + i.value, 0);

  // Mantém o total sincronizado com a soma dos itens.
  useEffect(() => {
    setBudget({ totalValue: itemsTotal });
  }, [itemsTotal, setBudget]);

  function add() {
    const v = Number(value.replace(",", "."));
    if (!desc.trim() || !Number.isFinite(v) || v <= 0) return;
    addItem({ kind, description: desc.trim(), value: v });
    setDesc("");
    setValue("");
  }

  const balance = Math.max(budget.totalValue - budget.amountPaid, 0);

  return (
    <div className="space-y-6">
      {/* Apenas orçamento */}
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={budgetOnly}
          onChange={(e) => setBudgetOnly(e.target.checked)}
        />
        Apenas orçamento (cliente vai levar o aparelho para pensar)
      </label>

      {/* Itens — colapsado */}
      <div>
        <button
          type="button"
          onClick={() => setItemsOpen(!itemsOpen)}
          className="flex w-full items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Peças e serviços
          <span className={`transition ${itemsOpen ? "rotate-180" : ""}`}>
            ▾
          </span>
        </button>

        {itemsOpen && (
          <div className="mt-3 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                className="field sm:w-36"
                value={kind}
                onChange={(e) => setKind(e.target.value as ItemKind)}
              >
                <option value="service">Serviço</option>
                <option value="part">Peça</option>
              </select>
              <input
                className="field flex-1"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Descrição (ex.: troca de tela)"
              />
              <input
                className="field sm:w-32"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Valor"
                inputMode="decimal"
              />
              <button className="btn-ghost" onClick={add}>
                Adicionar
              </button>
            </div>

            <ul className="mt-3 space-y-1">
              {items.map((i, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                >
                  <span>
                    <span className="mr-2 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] uppercase text-slate-500">
                      {i.kind === "part" ? "Peça" : "Serviço"}
                    </span>
                    {i.description}
                  </span>
                  <span className="flex items-center gap-3">
                    <strong>{brl(i.value)}</strong>
                    <button
                      className="text-xs text-red-500 hover:underline"
                      onClick={() => removeItem(idx)}
                    >
                      remover
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Valores e prazos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Prazo desejado pelo cliente</label>
          <input
            type="date"
            className="field"
            value={budget.desiredDeadline ?? ""}
            onChange={(e) => setBudget({ desiredDeadline: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Valor total</label>
          <input
            className="field"
            value={brl(budget.totalValue)}
            readOnly
          />
        </div>
        <div>
          <label className="label">Valor pago na entrada</label>
          <input
            className="field"
            inputMode="decimal"
            value={budget.amountPaid ? String(budget.amountPaid) : ""}
            onChange={(e) =>
              setBudget({ amountPaid: Number(e.target.value.replace(",", ".")) || 0 })
            }
            placeholder="0,00"
          />
        </div>
        <div>
          <label className="label">Forma de pagamento</label>
          <select
            className="field"
            value={budget.paymentMethod ?? ""}
            onChange={(e) =>
              setBudget({ paymentMethod: e.target.value as PaymentMethod })
            }
          >
            <option value="">Selecione…</option>
            {PAYMENTS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Funcionário que recebeu</label>
          <input
            className="field"
            value={budget.receivedBy ?? ""}
            onChange={(e) => setBudget({ receivedBy: e.target.value })}
            placeholder="Nome do atendente"
          />
        </div>
      </div>

      <div className="flex justify-end gap-6 rounded-xl bg-slate-50 px-4 py-3 text-sm">
        <span className="text-slate-500">
          Saldo restante: <strong className="text-slate-700">{brl(balance)}</strong>
        </span>
      </div>
    </div>
  );
}
