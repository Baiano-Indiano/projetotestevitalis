import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  FlaskConical,
  TestTube2,
  CheckCircle2,
  FileText,
  Beaker,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/data/store";
import { cn } from "@/lib/utils";
import { categoriasExames, itensDaCategoria } from "@/data/exames-catalogo";

export const Route = createFileRoute("/_equipe/painel/laboratorio")({
  head: () => ({ meta: [{ title: "Laboratório. Vitalis Belém" }] }),
  component: Laboratorio,
});

function acharExameLab(id: string): { label: string; categoria: string } | null {
  for (const cat of categoriasExames) {
    if (cat.id === "imagem") continue;
    const item = itensDaCategoria(cat).find((i) => i.id === id);
    if (item) return { label: item.label, categoria: cat.nome };
  }
  return null;
}

interface SolicitacaoLab {
  key: string;
  diagnosticoId: string;
  exameId: string;
  exameLabel: string;
  pacienteNome: string;
  especie: string;
  raca: string;
  tutorNome: string;
  solicitanteNome: string;
  protocolo?: string;
  justificativa: string;
  observacoesExame: string;
  suspeita: string;
  criadoEm: string;
  status: "solicitado" | "em_analise" | "concluido";
}


function formatarData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function Laboratorio() {
  const diagnosticos = useStore((s) => s.diagnosticos);
  const atualizarStatusExame = useStore((s) => s.atualizarStatusExame);
  const [busca, setBusca] = useState("");

  const solicitacoes = useMemo<SolicitacaoLab[]>(() => {
    const lista: SolicitacaoLab[] = [];
    for (const d of diagnosticos) {
      const c = d.conteudo as Record<string, unknown>;
      const exames = (c.examesSolicitados as string[] | undefined) ?? [];
      const statusMap = (c.statusExames as Record<string, SolicitacaoLab["status"]> | undefined) ?? {};
      for (const exId of exames) {
        const info = acharExameLab(exId);
        if (!info) continue;
        lista.push({
          key: `${d.id}:${exId}`,
          diagnosticoId: d.id,
          exameId: exId,
          exameLabel: info.label,
          pacienteNome: String(c.pacienteNome ?? "Paciente"),
          especie: String(c.especie ?? ""),
          raca: String(c.raca ?? ""),
          tutorNome: String(c.tutorNome ?? ""),
          solicitanteNome: String(c.solicitanteNome ?? "Equipe clínica"),
          protocolo: c.protocolo as string | undefined,
          justificativa: String(c.justificativa ?? ""),
          observacoesExame: String(c.observacoesExame ?? ""),
          suspeita: String(c.suspeitaPrincipal ?? ""),
          criadoEm: d.criadoEm,
          status: statusMap[exId] ?? "solicitado",
        });
      }
    }
    return lista;
  }, [diagnosticos]);

  const filtrados = useMemo(
    () =>
      solicitacoes.filter((s) =>
        `${s.pacienteNome} ${s.exameLabel} ${s.tutorNome}`.toLowerCase().includes(busca.toLowerCase()),
      ),
    [solicitacoes, busca],
  );

  const totalConcluidos = solicitacoes.filter((s) => s.status === "concluido").length;
  const totalPendentes = solicitacoes.length - totalConcluidos;

  const stats = [
    { label: "Pendentes", valor: totalPendentes, Icon: FlaskConical, tone: "bg-warning-50 text-warning-700" },
    { label: "Solicitações Totais", valor: solicitacoes.length, Icon: TestTube2, tone: "bg-primary-50 text-primary-700" },
    { label: "Concluídos", valor: totalConcluidos, Icon: CheckCircle2, tone: "bg-success-50 text-success-700" },
    { label: "Hoje", valor: solicitacoes.filter((s) => new Date(s.criadoEm).toDateString() === new Date().toDateString()).length, Icon: FileText, tone: "bg-muted text-text-strong" },
  ];

  const marcarConcluido = (s: SolicitacaoLab) =>
    atualizarStatusExame(s.diagnosticoId, s.exameId, "concluido");


  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Laboratório
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Solicitações de exames laboratoriais geradas pela Ficha Médica
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar paciente, exame ou tutor..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => {
          const I = s.Icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">{s.label}</p>
                <span className={cn("grid h-8 w-8 place-items-center rounded-lg", s.tone)}>
                  <I className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-text-strong">{s.valor}</p>
              <p className="text-xs text-text-soft">exames</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        {filtrados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <Beaker className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-display text-base font-semibold text-text-strong">
              Nenhuma solicitação laboratorial
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Os exames solicitados pela Ficha Médica aparecerão aqui em tempo real.
            </p>
          </div>
        ) : (
          filtrados.map((s) => {
            const concluido = s.status === "concluido";
            return (
              <div key={s.key} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary">
                      <FlaskConical className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-text-strong">
                        {s.exameLabel}
                        {s.protocolo && (
                          <span className="ml-2 rounded-full bg-primary-50 px-2 py-0.5 font-mono text-[10px] text-primary-800">
                            {s.protocolo}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Paciente: <span className="font-medium text-text-strong">{s.pacienteNome}</span>
                        {s.especie && ` (${s.especie}${s.raca ? `, ${s.raca}` : ""})`}
                        {s.tutorNome && ` · Tutor: ${s.tutorNome}`}
                      </p>
                      <p className="mt-0.5 text-xs text-text-soft">
                        {formatarData(s.criadoEm)} · Solicitado por {s.solicitanteNome}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      concluido
                        ? "bg-success-50 text-success-700"
                        : "bg-warning-50 text-warning-700",
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", concluido ? "bg-success" : "bg-warning")} />
                    {concluido ? "Concluído" : "Pendente"}
                  </span>
                </div>

                <div className="mt-4 rounded-lg border border-border bg-background p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">
                    Justificativa clínica
                  </p>
                  <p className="mt-1 text-sm text-text-strong">
                    {s.justificativa || s.suspeita || "Sem justificativa registrada."}
                  </p>
                  {s.observacoesExame && (
                    <>
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-text-soft">
                        Observações para o laboratório
                      </p>
                      <p className="mt-1 text-sm text-text-strong">{s.observacoesExame}</p>
                    </>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  {concluido ? (
                    <Button variant="outline" size="sm">
                      <FileText className="mr-1.5 h-3.5 w-3.5" /> Ver laudo
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm">Imprimir etiquetas</Button>
                      <Button size="sm" onClick={() => marcarConcluido(s)}>
                        Analisar e liberar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
