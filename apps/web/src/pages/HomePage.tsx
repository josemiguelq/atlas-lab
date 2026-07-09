import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Bem-vindo ao Atlas
      </h1>
      <p className="mt-2 max-w-xl text-slate-500">
        Sistema para oficinas de conserto. Nesta etapa o foco é o fluxo de
        criação de Ordem de Serviço, guiado passo a passo como um tutorial, com
        inspeção do aparelho em 3D.
      </p>
      <Link to="/os/new" className="btn-primary mt-6">
        🧾 Criar nova OS
      </Link>
    </div>
  );
}
