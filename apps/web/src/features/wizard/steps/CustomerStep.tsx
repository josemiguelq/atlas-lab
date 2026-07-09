import { useWizard } from "../../../store/wizard.js";

export function CustomerStep() {
  const customer = useWizard((s) => s.customer);
  const setCustomer = useWizard((s) => s.setCustomer);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="label">Nome do cliente *</label>
        <input
          className="field"
          value={customer.name}
          onChange={(e) => setCustomer({ name: e.target.value })}
          placeholder="Ex.: Maria Silva"
          autoFocus
        />
      </div>
      <div>
        <label className="label">Telefone / WhatsApp</label>
        <input
          className="field"
          value={customer.phone ?? ""}
          onChange={(e) => setCustomer({ phone: e.target.value })}
          placeholder="(11) 99999-0000"
        />
      </div>
      <div>
        <label className="label">E-mail</label>
        <input
          className="field"
          type="email"
          value={customer.email ?? ""}
          onChange={(e) => setCustomer({ email: e.target.value })}
          placeholder="cliente@email.com"
        />
      </div>
      <div>
        <label className="label">CPF / CNPJ</label>
        <input
          className="field"
          value={customer.doc ?? ""}
          onChange={(e) => setCustomer({ doc: e.target.value })}
          placeholder="000.000.000-00"
        />
      </div>
    </div>
  );
}
