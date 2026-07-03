import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useVitalisStore } from "@/data/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RedFlagBanner } from "@/components/RedFlagBanner";
import { sintomaPorId } from "@/data/sintomas";
import { municipio, nomeEspecialidade, especialidadesAtivas } from "@/config/municipio";
import { tempoEsperaTexto } from "@/lib/triagem";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Phone,
  RotateCcw,
  Sparkles,
  User,
  ShieldCheck,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusPill, PrioridadePill } from "@/components/StatusPill";
import type { EspecialidadeId } from "@/config/municipio";
import type { Prioridade } from "@/data/types";


export const Route = createFileRoute("/_equipe/painel/validacao/$id")({
  head: () => ({ meta: [{ title: "Caso clínico. Validação Vitalis" }] }),
  component: Detalhe,
  notFoundComponent: () => (
    <Card className="border-dashed border-border bg-surface p-10 text-center">
      <p className="font-display text-base font-semibold text-text-strong">
        Caso não encontrado
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Esta triagem pode ter sido removida ou já validada por outro veterinário.
      </p>
    </Card>
  ),
});

function Detalhe() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { triagens, decidir, decisoes } = useVitalisStore();
  const t = triagens.find((x) => x.id === id);
  if (!t) throw notFound();

  const ranking = useMemo(
    () =>
      (Object.entries(t.scores) as [EspecialidadeId, number][])
        .sort((a, b) => b[1] - a[1]),
    [t.scores],
  );
  const maxScore = ranking[0]?.[1] ?? 1;
  const sugestaoEspecialidade =
    t.sugestao !== "urgencia" ? t.sugestao : ranking[0]?.[0];

  const [especialidade, setEspecialidade] = useState<EspecialidadeId>(
    (sugestaoEspecialidade as EspecialidadeId) ?? "traumatologia",
  );
  const [prioridade, setPrioridade] = useState<Prioridade>(t.prioridade);
  const [observacao, setObservacao] = useState("");
  const [textoOriginal, setTextoOriginal] = useState(false);

  const urgente = t.redFlags.length > 0 || t.status === "urgencia";
  const jaDecidido = decisoes.find((d) => d.triagemId === t.id);

  const [lgpdOpen, setLgpdOpen] = useState(false);
  const [decisaoPendente, setDecisaoPendente] = useState<null | "confirmar" | "redirecionar" | "urgencia">(null);

  const executarDecisao = (acao: "confirmar" | "redirecionar" | "urgencia") => {

    if (jaDecidido) {
      toast.error("Este caso já foi assumido por outro veterinário.");
      return;
    }
    const especialidadeFinal: EspecialidadeId | "urgencia" =
      acao === "urgencia" ? "urgencia" : especialidade;
    const concordanciaIA = especialidadeFinal === t.sugestao;
    decidir({
      triagemId: t.id,
      veterinario: "Dra. Marina Vieira",
      acao,
      especialidadeFinal,
      observacao: observacao || undefined,
      concordanciaIA,
      decididoEm: new Date().toISOString(),
    });
    toast.success(
      acao === "urgencia"
        ? "Caso encaminhado para urgência."
        : acao === "redirecionar"
          ? `Redirecionado para ${nomeEspecialidade(especialidade)}.`
          : `Encaminhamento confirmado para ${nomeEspecialidade(especialidade)}.`,
    );
    // Seleciona o próximo caso pendente, se houver.
    const proximo = triagens.find(
      (x) => x.id !== t.id && x.status === "pendente",
    );
    if (proximo) navigate({ to: "/painel/validacao/$id", params: { id: proximo.id } });
    else navigate({ to: "/painel/validacao" });
  };

  // Atalhos de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "j" || e.key === "k") {
        const ordered = [...triagens].sort((a, b) => {
          const af = a.redFlags.length > 0 ? 1 : 0;
          const bf = b.redFlags.length > 0 ? 1 : 0;
          if (af !== bf) return bf - af;
          return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
        });
        const idx = ordered.findIndex((x) => x.id === t.id);
        const next = e.key === "j" ? ordered[idx + 1] : ordered[idx - 1];
        if (next) navigate({ to: "/painel/validacao/$id", params: { id: next.id } });
      }
      if (e.key === "Enter") {
        e.preventDefault();
        decidirCaso(urgente ? "urgencia" : "confirmar");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.id, urgente, especialidade]);

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <Card className="border-border bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-text-soft">{t.protocolo}</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-text-strong">
              {t.animal.nome}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {t.animal.especie === "cao" ? "Cão" : t.animal.especie === "gato" ? "Gato" : "Outro"} ·{" "}
                {t.animal.raca} · {t.animal.idade} · {t.animal.sexo === "macho" ? "Macho" : "Fêmea"}
              </span>
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" /> {t.tutor.nome}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4" /> {t.tutor.telefone}
              </span>
              <span>{t.canal === "online" ? "Triagem online" : "Unidade móvel"}</span>
              <span>Espera {tempoEsperaTexto(t.criadoEm)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PrioridadePill prioridade={t.prioridade} />
            <StatusPill
              status={
                t.status === "urgencia"
                  ? "urgencia"
                  : t.status === "validada"
                    ? "validada"
                    : t.status === "redirecionada"
                      ? "redirecionada"
                      : "aguardando"
              }
            />
          </div>
        </div>
      </Card>

      {urgente && <RedFlagBanner ids={t.redFlags} />}

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* Resumo IA */}
          {t.etapas.observacoes && (
            <Card className="border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary-700">
                  <Sparkles className="h-3.5 w-3.5" /> Resumo interpretado por IA
                </p>
                <button
                  type="button"
                  onClick={() => setTextoOriginal((v) => !v)}
                  className="text-xs font-medium text-primary-700 hover:underline"
                >
                  {textoOriginal ? "ver resumo" : "ver texto original"}
                </button>
              </div>
              <p className="mt-2 text-sm text-text-strong">
                {textoOriginal
                  ? t.etapas.observacoes
                  : resumirObservacao(t.etapas.observacoes, t.etapas.sintomas)}
              </p>
              {t.etapas.chipsIA && t.etapas.chipsIA.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.etapas.chipsIA.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 rounded-full border border-primary-100 bg-primary-50 px-2.5 py-0.5 text-xs text-primary-800"
                    >
                      <Sparkles className="h-3 w-3" />
                      {sintomaPorId(id)?.nome ?? id}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Sintomas estruturados */}
          <Card className="border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">
              Sintomas estruturados
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.etapas.sintomas.map((id) => {
                const s = sintomaPorId(id);
                return (
                  <span
                    key={id}
                    className={
                      s?.redFlag
                        ? "inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive-50 px-2.5 py-1 text-xs font-medium text-destructive-700"
                        : "inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs text-text-strong"
                    }
                  >
                    {s?.redFlag && <AlertTriangle className="h-3 w-3" />}
                    {s?.nome ?? id}
                  </span>
                );
              })}
            </div>
            {t.etapas.estadoAtual && (
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-sm xl:grid-cols-4">
                <Info l="Consciência" v={t.etapas.estadoAtual.consciencia} />
                <Info l="Apetite" v={t.etapas.estadoAtual.apetite} />
                <Info l="Hidratação" v={t.etapas.estadoAtual.hidratacao} />
                <Info l="Comportamento" v={t.etapas.estadoAtual.comportamento} />
              </dl>
            )}
            {t.etapas.tempo && t.etapas.ambiente && (
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm xl:grid-cols-4">
                <Info l="Início" v={t.etapas.tempo.inicio} />
                <Info l="Duração" v={t.etapas.tempo.duracao} />
                <Info l="Ambiente" v={t.etapas.ambiente.ambiente} />
                <Info
                  l="Vacinação"
                  v={t.etapas.ambiente.vacinado ? "em dia" : "atrasada"}
                />
              </dl>
            )}
          </Card>

          {/* Hipóteses por especialidade */}
          <Card className="border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">
              Hipóteses por especialidade
            </p>
            {ranking.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Nenhuma pontuação calculada.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {ranking.map(([esp, score]) => (
                  <li key={esp}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-text-strong">
                        {nomeEspecialidade(esp)}
                      </span>
                      <span className="font-mono text-xs text-text-soft">score {Math.round(score)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.round((score / maxScore) * 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-text-soft">
                      Contribuintes:{" "}
                      {(t.etapas.sintomas || [])
                        .filter((id) => sintomaPorId(id)?.pesos[esp])
                        .map((id) => sintomaPorId(id)?.nome)
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Painel de decisão */}
        <aside className="space-y-4">
          <Card className="border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">
              Decisão clínica
            </p>

            <div className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-medium text-text-strong">Especialidade</label>
                <Select
                  value={especialidade}
                  onValueChange={(v) => setEspecialidade(v as EspecialidadeId)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidadesAtivas().map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-strong">Prioridade</label>
                <Select value={prioridade} onValueChange={(v) => setPrioridade(v as Prioridade)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-strong">
                  Observação clínica (opcional)
                </label>
                <Textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  rows={3}
                  placeholder="Notas para a equipe do encaminhamento"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {urgente ? (
                <>
                  <Button variant="destructive" onClick={() => decidirCaso("urgencia")}>
                    <AlertTriangle className="mr-1.5 h-4 w-4" /> Encaminhar para urgência
                  </Button>
                  <Button variant="outline" onClick={() => decidirCaso("confirmar")}>
                    <Check className="mr-1.5 h-4 w-4" /> Confirmar {nomeEspecialidade(especialidade)}
                  </Button>
                  <Button variant="ghost" onClick={() => decidirCaso("redirecionar")}>
                    <RotateCcw className="mr-1.5 h-4 w-4" /> Redirecionar
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => decidirCaso("confirmar")} className="h-auto min-h-10 whitespace-normal py-2 text-center leading-tight">
                    <Check className="mr-1.5 h-4 w-4 shrink-0" />
                    <span>Confirmar encaminhamento para {nomeEspecialidade(especialidade)}</span>
                  </Button>
                  <Button variant="outline" onClick={() => decidirCaso("redirecionar")}>
                    <RotateCcw className="mr-1.5 h-4 w-4" /> Redirecionar
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive-700 hover:bg-destructive-50 hover:text-destructive-700"
                    onClick={() => decidirCaso("urgencia")}
                  >
                    <AlertTriangle className="mr-1.5 h-4 w-4" /> Marcar como urgência
                  </Button>
                </>
              )}
            </div>

            <p className="mt-3 text-[11px] text-text-soft">
              Atalhos: J e K navegam pela fila. Enter confirma. O Vitalis orienta,
              você decide.
            </p>
          </Card>

          <Card className="border-border bg-surface p-4 text-xs text-muted-foreground">
            <p>
              Unidade sugerida: <strong className="text-text-strong">
                {urgente ? municipio.unidades.find((u) => u.atendimento24h)?.nome : municipio.unidades[0].nome}
              </strong>
            </p>
            <p className="mt-1 inline-flex items-center gap-1">
              <ArrowRight className="h-3 w-3" /> Encaminhamento gera a ficha no setor de destino.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Info({ l, v }: { l: string; v: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] uppercase tracking-wide text-text-soft break-words">{l}</dt>
      <dd className="mt-0.5 text-sm font-medium text-text-strong capitalize break-words">{v}</dd>
    </div>
  );
}

function resumirObservacao(texto: string, sintomas: string[]): string {
  const nomes = sintomas
    .map((id) => sintomaPorId(id)?.nome)
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");
  if (!nomes) return texto;
  return `Quadro com ${nomes.toLowerCase()}. Relato do tutor: ${texto.length > 140 ? texto.slice(0, 140) + "..." : texto}`;
}
