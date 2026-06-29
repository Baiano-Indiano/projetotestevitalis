import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useVitalisStore } from "@/data/store";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Eye, Download, Info, FileCheck, Clock, Send, PawPrint, Stethoscope, Flag, User2, Phone, Calendar, ListChecks } from "lucide-react";
import { getItemById } from "@/data/sintomas-categorias";
import { nomeEspecialidade } from "@/config/municipio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tutor/triagem/resultado")({
  head: () => ({
    meta: [
      { title: "Triagem recebida. Vitalis Belém" },
      { name: "description", content: "Sua triagem foi recebida e está na fila de análise técnica." },
    ],
  }),
  component: Resultado,
});

function Resultado() {
  const { triagens, ultimaTriagemId } = useVitalisStore();
  const t = triagens.find((x) => x.id === ultimaTriagemId);
  const [copiado, setCopiado] = useState(false);
  const [confirmVisivel, setConfirmVisivel] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setConfirmVisivel(false), 4000);
    return () => clearTimeout(id);
  }, []);

  if (!t) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-text-strong">Nenhuma triagem recente</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inicie uma nova triagem para ver o resultado aqui.</p>
        <Button asChild className="mt-6"><Link to="/triagem">Iniciar triagem</Link></Button>
      </div>
    );
  }

  const urgente = t.sugestao === "urgencia";
  const prioridadeLabel = urgente ? "Urgente" : t.prioridade === "alta" ? "Recomendado" : t.prioridade === "media" ? "Recomendado" : "Simples";
  const prioridadeCor = urgente ? "text-destructive" : t.prioridade === "alta" || t.prioridade === "media" ? "text-warning-700" : "text-success-700";
  const prioridadeDot = urgente ? "bg-destructive" : t.prioridade === "alta" || t.prioridade === "media" ? "bg-warning" : "bg-success";

  const copy = () => {
    navigator.clipboard.writeText(t.protocolo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,var(--color-primary-50)_0%,var(--color-background)_60%)] py-8 md:py-14">
      <div className="container-app">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
            {/* Ícone de sucesso */}
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-50">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>

            <h1 className="mt-5 text-center font-display text-2xl font-semibold tracking-tight text-text-strong md:text-3xl">
              Triagem Recebida com Sucesso!
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Sua solicitação foi enviada e já está na fila de análise da nossa equipe técnica veterinária.
            </p>

            {/* Protocolo */}
            <div className="mt-6 rounded-xl bg-primary-50 px-5 py-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                Número de Protocolo
              </p>
              <button
                onClick={copy}
                className="mt-1 inline-flex items-center gap-2 font-mono text-xl font-bold text-primary"
              >
                {t.protocolo}
                <Copy className="h-4 w-4 opacity-60" />
              </button>
              {copiado && <p className="mt-1 text-xs text-success-700">Copiado.</p>}
            </div>

            {/* Cards de info */}
            <div className="mt-4 grid gap-3">
              <InfoLinha icone={PawPrint} rotulo="Paciente" valor={`${t.animal.nome} (${t.animal.especie === "cao" ? "Cão" : t.animal.especie === "gato" ? "Gato" : "Animal"})`} />
              <InfoLinha
                icone={Stethoscope}
                rotulo="Especialidade"
                valor={urgente ? "Urgência" : nomeEspecialidade(t.sugestao as never)}
              />
              <InfoLinha
                icone={Flag}
                rotulo="Prioridade"
                valor={
                  <span className={cn("inline-flex items-center gap-1.5 font-semibold", prioridadeCor)}>
                    <span className={cn("h-2 w-2 rounded-full", prioridadeDot)} />
                    {prioridadeLabel}
                  </span>
                }
              />
            </div>

            {/* Resumo rápido dos dados enviados */}
            <div className="mt-5 rounded-xl border border-border bg-background p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-soft">
                <ListChecks className="h-3.5 w-3.5" /> Resumo do envio
              </p>
              <dl className="mt-3 grid gap-2 text-sm">
                <ResumoLinha icone={User2} rotulo="Tutor" valor={t.tutor.nome} />
                <ResumoLinha icone={Phone} rotulo="Contato" valor={t.tutor.telefone} />
                <ResumoLinha icone={PawPrint} rotulo="Animal" valor={`${t.animal.nome} • ${t.animal.raca} • ${t.animal.idade}`} />
                <ResumoLinha
                  icone={ListChecks}
                  rotulo={`Sintomas (${t.etapas.sintomas.length})`}
                  valor={
                    t.etapas.sintomas.length > 0
                      ? t.etapas.sintomas.map((id) => getItemById(id)?.label ?? id).join(" • ")
                      : "Nenhum sintoma marcado"
                  }
                />
                {t.etapas.observacoes && (
                  <ResumoLinha icone={Info} rotulo="Observações" valor={t.etapas.observacoes} />
                )}
                <ResumoLinha icone={Calendar} rotulo="Enviado em" valor={new Date(t.criadoEm).toLocaleString("pt-BR")} />
              </dl>
            </div>

            {/* Próximos passos */}
            <div className="mt-7">
              <p className="text-sm font-semibold text-text-strong">Próximos Passos</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Passo concluido label="Triagem Recebida" icone={FileCheck} />
                <Passo atual label="Análise Técnica" icone={Clock} />
                <Passo label="Retorno ao Tutor" icone={Send} />
              </div>
            </div>


            {/* Aviso */}
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive-50/60 p-4 text-sm">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div>
                <p className="font-semibold text-text-strong">Aviso Importante</p>
                <p className="mt-1 text-muted-foreground">
                  O envio desta triagem não substitui o atendimento emergencial presencial. Se o estado do animal agravar, dirija-se imediatamente à unidade mais próxima.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 grid gap-2.5">
              <Button asChild size="lg">
                <Link to="/meus-atendimentos">
                  <Eye className="mr-2 h-4 w-4" /> Acompanhar Solicitação
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-primary-50 text-primary-800 border-transparent hover:bg-primary-100">
                <Download className="mr-2 h-4 w-4" /> Baixar Protocolo (PDF)
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                <Link to="/">Voltar para o Início</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoLinha({ icone: Icone, rotulo, valor }: { icone: typeof PawPrint; rotulo: string; valor: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3">
      <p className="flex items-center gap-1.5 text-xs text-text-soft">
        <Icone className="h-3.5 w-3.5" />
        {rotulo}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-text-strong">{valor}</p>
    </div>
  );
}

function Passo({ label, icone: Icone, concluido, atual }: { label: string; icone: typeof PawPrint; concluido?: boolean; atual?: boolean }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full border-2",
          concluido && "border-success bg-success text-success-foreground",
          atual && "border-primary text-primary bg-primary-50",
          !concluido && !atual && "border-border text-text-soft bg-background",
        )}
      >
        <Icone className="h-4 w-4" />
      </span>
      <p className={cn("mt-2 text-xs font-medium leading-tight", concluido ? "text-success-700" : atual ? "text-primary" : "text-text-soft")}>
        {label}
      </p>
    </div>
  );
}

function ResumoLinha({ icone: Icone, rotulo, valor }: { icone: typeof PawPrint; rotulo: string; valor: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <Icone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-soft" />
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-text-soft">{rotulo}</dt>
        <dd className="text-sm text-text-strong break-words">{valor}</dd>
      </div>
    </div>
  );
}
