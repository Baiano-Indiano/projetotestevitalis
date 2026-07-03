import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Plus,
  Clock,
  Calendar,
  Droplet,
  Activity,
  Microscope,
  CheckCircle2,
  Check,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, type StatusExame } from "@/data/store";
import { categoriasExames, itensDaCategoria } from "@/data/exames-catalogo";
import { categoriasImagem, itensDaCategoriaImagem } from "@/data/imagem-catalogo";

export const Route = createFileRoute("/_equipe/painel/exames")({
  head: () => ({ meta: [{ title: "Solicitações de Exames. Vitalis Belém" }] }),
  component: Exames,
});

type Modalidade = "laboratorio" | "imagem";

interface Solicitacao {
  key: string;
  diagnosticoId: string;
  exameId: string;
  exameLabel: string;
  categoria: string;
  modalidade: Modalidade;
  pacienteNome: string;
  especie: string;
  raca: string;
  tutorNome: string;
  solicitanteNome: string;
  protocolo?: string;
  justificativa: string;
  criadoEm: string;
  status: StatusExame;
}

function acharExame(id: string): { label: string; categoria: string; modalidade: Modalidade } | null {
  for (const cat of categoriasExames) {
    if (cat.id === "imagem") continue;
    const item = itensDaCategoria(cat).find((i) => i.id === id);
    if (item) return { label: item.label, categoria: cat.nome, modalidade: "laboratorio" };
  }
  for (const cat of categoriasImagem) {
    const item = itensDaCategoriaImagem(cat).find((i) => i.id === id);
    if (item) return { label: item.label, categoria: cat.nome, modalidade: "imagem" };
  }
  return null;
}

function formatarData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function statusLabel(s: StatusExame): string {
  if (s === "concluido") return "Concluído";
  if (s === "em_analise") return "Em análise";
  return "Solicitado";
}

function statusTone(s: StatusExame): string {
  if (s === "concluido") return "bg-success-50 text-success-700";
  if (s === "em_analise") return "bg-warning-50 text-warning-700";
  return "bg-primary-50 text-primary-800";
}

function Exames() {
  const diagnosticos = useStore((s) => s.diagnosticos);
  const [busca, setBusca] = useState("");

  const solicitacoes = useMemo<Solicitacao[]>(() => {
    const lista: Solicitacao[] = [];
    for (const d of diagnosticos) {
      const c = d.conteudo as Record<string, unknown>;
      const exames = (c.examesSolicitados as string[] | undefined) ?? [];
      const statusMap = (c.statusExames as Record<string, StatusExame> | undefined) ?? {};
      for (const exId of exames) {
        const info = acharExame(exId);
        if (!info) continue;
        lista.push({
          key: `${d.id}:${exId}`,
          diagnosticoId: d.id,
          exameId: exId,
          exameLabel: info.label,
          categoria: info.categoria,
          modalidade: info.modalidade,
          pacienteNome: String(c.pacienteNome ?? "Paciente"),
          especie: String(c.especie ?? ""),
          raca: String(c.raca ?? ""),
          tutorNome: String(c.tutorNome ?? ""),
          solicitanteNome: String(c.solicitanteNome ?? "Equipe clínica"),
          protocolo: c.protocolo as string | undefined,
          justificativa: String(c.justificativa ?? c.suspeitaPrincipal ?? ""),
          criadoEm: d.criadoEm,
          status: statusMap[exId] ?? "solicitado",
        });
      }
    }
    return lista;
  }, [diagnosticos]);

  const filtradas = useMemo(
    () =>
      solicitacoes.filter((s) =>
        `${s.pacienteNome} ${s.exameLabel} ${s.tutorNome} ${s.categoria}`
          .toLowerCase()
          .includes(busca.toLowerCase()),
      ),
    [solicitacoes, busca],
  );

  const hojeStr = new Date().toDateString();
  const pendentes = solicitacoes.filter((s) => s.status !== "concluido").length;
  const hoje = solicitacoes.filter((s) => new Date(s.criadoEm).toDateString() === hojeStr).length;
  const concluidos = solicitacoes.filter((s) => s.status === "concluido").length;
  const laboratorio = solicitacoes.filter((s) => s.modalidade === "laboratorio").length;
  const imagem = solicitacoes.filter((s) => s.modalidade === "imagem").length;
  const emAnalise = solicitacoes.filter((s) => s.status === "em_analise").length;

  const stats = [
    { Icon: Clock, label: "Pendentes", valor: pendentes, bg: "bg-destructive-50 text-destructive" },
    { Icon: Calendar, label: "Hoje", valor: hoje, bg: "bg-primary-50 text-primary" },
    { Icon: Droplet, label: "Laboratório", valor: laboratorio, bg: "bg-success-50 text-success-700" },
    { Icon: Activity, label: "Imagem", valor: imagem, bg: "bg-warning-50 text-warning-700" },
    { Icon: Microscope, label: "Em análise", valor: emAnalise, bg: "bg-primary-50 text-primary" },
    { Icon: CheckCircle2, label: "Concluídos", valor: concluidos, bg: "bg-success-50 text-success-700" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Solicitações de Exames
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestão de diagnósticos laboratoriais e de imagem.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-56 pl-9"
              placeholder="Buscar paciente ou exame..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-1.5 h-3.5 w-3.5" /> Filtros
          </Button>
          <Button size="sm" className="bg-success hover:bg-success/90">
            <Plus className="mr-1 h-3.5 w-3.5" /> Nova Solicitação
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => {
          const Icone = s.Icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">{s.label}</p>
                <span className={cn("grid h-7 w-7 place-items-center rounded-lg", s.bg)}>
                  <Icone className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-text-strong">{s.valor}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-text-strong">
            Lista de Solicitações ({filtradas.length})
          </h2>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Ordenar por Data
          </span>
        </div>

        {filtradas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-display text-base font-semibold text-text-strong">
              Nenhuma solicitação de exame
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Os exames prescritos pela Ficha Médica aparecerão aqui em tempo real.
            </p>
          </div>
        ) : (
          filtradas.map((s) => {
            const IconExame = s.modalidade === "imagem" ? Activity : Droplet;
            return (
              <div key={s.key} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary">
                      <IconExame className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-text-strong">
                        {s.exameLabel}
                        {s.protocolo && (
                          <span className="ml-2 rounded-full bg-primary-50 px-2 py-0.5 font-mono text-[10px] text-primary-800">
                            {s.protocolo}
                          </span>
                        )}
                        <span className="ml-2 text-[10px] font-medium uppercase tracking-wide text-text-soft">
                          {s.categoria}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Paciente:{" "}
                        <span className="font-medium text-text-strong">{s.pacienteNome}</span>
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
                      statusTone(s.status),
                    )}
                  >
                    {s.status === "concluido" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    )}
                    {statusLabel(s.status)}
                  </span>
                </div>

                {s.justificativa && (
                  <div className="mt-4 rounded-lg border border-border bg-background p-3 text-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">
                      Justificativa
                    </p>
                    <p className="mt-1 text-text-strong">{s.justificativa}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link
                      to={s.modalidade === "imagem" ? "/painel/imagem" : "/painel/laboratorio"}
                    >
                      Abrir em {s.modalidade === "imagem" ? "Imagem" : "Laboratório"}
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
