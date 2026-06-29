import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Users, FolderOpen, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/veterinarios")({
  head: () => ({ meta: [{ title: "Veterinários Disponíveis. Vitalis Belém" }] }),
  component: Veterinarios,
});

const vets = [
  { iniciais: "RS", nome: "Dr. Ricardo Silva", esp: "Clínica Geral", status: "disponivel", pacientes: 0, vaga: "Agora" },
  { iniciais: "AM", nome: "Dra. Ana Mendes", esp: "Cardiologia", status: "atendimento", pacientes: 2, vaga: "10:45" },
  { iniciais: "MS", nome: "Dr. Marcos Souza", esp: "Ortopedia", status: "pausa", pacientes: 0, vaga: "11:30" },
  { iniciais: "CL", nome: "Dr. Carlos Lima", esp: "Dermatologia", status: "disponivel", pacientes: 1, vaga: "Agora" },
  { iniciais: "JP", nome: "Dra. Juliana Pires", esp: "Nefrologia", status: "atendimento", pacientes: 3, vaga: "11:15" },
];

export function statusPill(s: string) {
  const map: Record<string, { c: string; d: string; label: string }> = {
    disponivel: { c: "bg-success-50 text-success-700", d: "bg-success", label: "Disponível" },
    atendimento: { c: "bg-primary-50 text-primary-800", d: "bg-primary", label: "Em atendimento" },
    pausa: { c: "bg-warning-50 text-warning-700", d: "bg-warning", label: "Em pausa" },
  };
  const cfg = map[s];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", cfg.c)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.d)} /> {cfg.label}
    </span>
  );
}

function Veterinarios() {
  const stats = [
    { Icon: Users, label: "Total", valor: 24, cor: "text-text-soft", dot: "" },
    { Icon: Users, label: "Disponíveis", valor: 12, cor: "text-success-700", dot: "bg-success" },
    { Icon: Users, label: "Em atendimento", valor: 8, cor: "text-primary", dot: "bg-primary" },
    { Icon: Users, label: "Em pausa", valor: 4, cor: "text-warning-700", dot: "bg-warning" },
    { Icon: Users, label: "Especialistas", valor: "6 Ativos", cor: "text-text-strong", dot: "" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
        Veterinários Disponíveis
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Acompanhe a disponibilidade da equipe veterinária em tempo real.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => {
          const Icone = s.Icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <p className="flex items-center gap-1.5 text-xs text-text-soft">
                {s.dot ? <span className={cn("h-2 w-2 rounded-full", s.dot)} /> : <Icone className="h-3.5 w-3.5" />}
                {s.label}
              </p>
              <p className={cn("mt-2 font-display text-2xl font-bold", s.cor)}>{s.valor}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar veterinário..." />
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> Especialidade</Button>
          <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> Status</Button>
          <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> Disponibilidade</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-text-soft">
              <tr>
                <th className="px-4 py-3">Veterinário</th>
                <th className="px-4 py-3">Especialidade</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Pacientes</th>
                <th className="px-4 py-3">Próxima Vaga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {vets.map((v) => (
                <tr key={v.nome} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary">
                        {v.iniciais}
                      </span>
                      <span className="font-medium text-text-strong">{v.nome}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-text-strong">{v.esp}</span>
                  </td>
                  <td className="px-4 py-3">{statusPill(v.status)}</td>
                  <td className="px-4 py-3 text-text-strong">{v.pacientes} pacientes</td>
                  <td className="px-4 py-3 font-semibold text-text-strong">{v.vaga}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
