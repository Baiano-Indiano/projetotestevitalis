import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { veterinarios } from "@/data/veterinarios";
import { municipio } from "@/config/municipio";

export const Route = createFileRoute("/_equipe/painel/veterinarios")({
  head: () => ({ meta: [{ title: "Veterinários Disponíveis. Vitalis Belém" }] }),
  component: Veterinarios,
});

type StatusVet = "disponivel" | "atendimento" | "pausa";

// Disponibilidade operacional do dia, ancorada nos profissionais da base única
// em src/data/veterinarios.ts para manter consistência com a Agenda e a Triagem.
const disponibilidade: Record<string, { status: StatusVet; pacientes: number; vaga: string }> = {
  "vet-rs": { status: "disponivel", pacientes: 0, vaga: "Agora" },
  "vet-am": { status: "atendimento", pacientes: 2, vaga: "10:45" },
  "vet-ms": { status: "pausa", pacientes: 0, vaga: "11:30" },
  "vet-cl": { status: "disponivel", pacientes: 1, vaga: "Agora" },
  "vet-jp": { status: "atendimento", pacientes: 3, vaga: "11:15" },
};

export function statusPill(s: StatusVet) {
  const map: Record<StatusVet, { c: string; d: string; label: string }> = {
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
  const [busca, setBusca] = useState("");

  const linhas = useMemo(
    () =>
      veterinarios.map((v) => {
        const d = disponibilidade[v.id] ?? { status: "disponivel" as StatusVet, pacientes: 0, vaga: "Agora" };
        const esp = municipio.especialidades.find((e) => e.id === v.especialidadeId)?.nome ?? v.especialidadeId;
        return { ...v, ...d, esp };
      }),
    [],
  );

  const filtrada = useMemo(() => {
    if (!busca.trim()) return linhas;
    const q = busca.toLowerCase();
    return linhas.filter(
      (v) => v.nome.toLowerCase().includes(q) || v.esp.toLowerCase().includes(q),
    );
  }, [linhas, busca]);

  const totais = useMemo(() => {
    const por = (s: StatusVet) => linhas.filter((v) => v.status === s).length;
    return {
      total: linhas.length,
      disponiveis: por("disponivel"),
      atendimento: por("atendimento"),
      pausa: por("pausa"),
      especialistas: new Set(linhas.map((v) => v.especialidadeId)).size,
    };
  }, [linhas]);

  const stats = [
    { Icon: Users, label: "Total", valor: totais.total, cor: "text-text-soft", dot: "" },
    { Icon: Users, label: "Disponíveis", valor: totais.disponiveis, cor: "text-success-700", dot: "bg-success" },
    { Icon: Users, label: "Em atendimento", valor: totais.atendimento, cor: "text-primary", dot: "bg-primary" },
    { Icon: Users, label: "Em pausa", valor: totais.pausa, cor: "text-warning-700", dot: "bg-warning" },
    { Icon: Users, label: "Especialidades", valor: `${totais.especialistas} ativas`, cor: "text-text-strong", dot: "" },
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
            <Input
              className="pl-9"
              placeholder="Buscar veterinário..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
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
              {filtrada.map((v) => (
                <tr key={v.id} className="hover:bg-muted/30">
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
