import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, PawPrint, Calendar, FileText, Download, FlaskConical, User2, Phone, Stethoscope, ClipboardList, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useVitalisStore } from "@/data/store";
import { Button } from "@/components/ui/button";
import { StatusPill, type StatusKey } from "@/components/StatusPill";
import { staggerContainer, staggerItem, revealVariants } from "@/lib/motion";
import { nomeEspecialidade } from "@/config/municipio";
import type { Triagem, Agendamento } from "@/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tutor/atendimento/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do atendimento. Vitalis Belém" },
      { name: "description", content: "Acompanhe o andamento do seu atendimento veterinário na rede Vitalis." },
      { property: "og:title", content: "Detalhes do atendimento — Vitalis Belém" },
      { property: "og:description", content: "Linha do tempo, documentos e status do atendimento veterinário do seu pet." },
    ],
  }),
  notFoundComponent: () => (
    <div className="container-app py-16 text-center">
      <h1 className="font-display text-2xl font-semibold text-text-strong">Atendimento não encontrado</h1>
      <p className="mt-2 text-sm text-muted-foreground">Verifique o link ou volte para a lista.</p>
      <Button asChild className="mt-6">
        <Link to="/meus-atendimentos">Voltar</Link>
      </Button>
    </div>
  ),
  component: DetalhesAtendimento,
});

function DetalhesAtendimento() {
  const { id } = Route.useParams();
  const { triagens, agendamentos } = useVitalisStore();

  const triagem = triagens.find((t) => t.id === id);
  const agendamento = !triagem ? agendamentos.find((a) => a.id === id) : undefined;

  if (!triagem && !agendamento) throw notFound();

  return (
    <div className="container-app py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <motion.div initial="hidden" animate="show" variants={revealVariants}>
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
            <Link to="/meus-atendimentos">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar aos atendimentos
            </Link>
          </Button>
        </motion.div>

        {triagem ? <TriagemDetalhes t={triagem} /> : agendamento ? <AgendamentoDetalhes a={agendamento} /> : null}
      </div>
    </div>
  );
}

// ============= Triagem =============

function statusTriagem(t: Triagem): StatusKey {
  if (t.status === "urgencia") return "urgencia";
  if (t.status === "validada") return "validada";
  if (t.status === "redirecionada") return "redirecionada";
  return "aguardando";
}

function manchesterCor(t: Triagem): { bg: string; text: string; dot: string; label: string } {
  if (t.sugestao === "urgencia") return { bg: "bg-destructive-50 border-destructive/30", text: "text-destructive", dot: "bg-destructive", label: "Vermelho • Emergência" };
  if (t.prioridade === "alta") return { bg: "bg-warning-50 border-warning/30", text: "text-warning-700", dot: "bg-warning", label: "Laranja • Muito urgente" };
  if (t.prioridade === "media") return { bg: "bg-warning-50 border-warning/30", text: "text-warning-700", dot: "bg-warning", label: "Amarelo • Urgente" };
  return { bg: "bg-success-50 border-success/30", text: "text-success-700", dot: "bg-success", label: "Verde • Pouco urgente" };
}

function TriagemDetalhes({ t }: { t: Triagem }) {
  const cor = manchesterCor(t);
  const etapas = etapasTriagem(t);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-5">
      <motion.header variants={staggerItem} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-primary">
              <PawPrint className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs text-text-soft">Protocolo • <span className="font-mono">{t.protocolo}</span></p>
              <h1 className="font-display text-2xl font-semibold text-text-strong">{t.animal.nome}</h1>
              <p className="text-sm text-muted-foreground">
                {t.animal.especie === "cao" ? "Cão" : t.animal.especie === "gato" ? "Gato" : "Animal"} • {t.animal.raca} • {t.animal.idade}
              </p>
            </div>
          </div>
          <StatusPill status={statusTriagem(t)} />
        </div>

        <div className={cn("mt-5 flex items-center gap-3 rounded-xl border px-4 py-3", cor.bg)}>
          <span className={cn("h-3 w-3 rounded-full", cor.dot)} />
          <div>
            <p className={cn("text-xs font-semibold uppercase tracking-wider", cor.text)}>Classificação Manchester</p>
            <p className="text-sm font-medium text-text-strong">{cor.label}</p>
          </div>
        </div>

        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <Info icone={Stethoscope} rotulo="Especialidade" valor={t.sugestao === "urgencia" ? "Urgência" : nomeEspecialidade(t.sugestao)} />
          <Info icone={User2} rotulo="Tutor" valor={t.tutor.nome} />
          <Info icone={Phone} rotulo="Contato" valor={t.tutor.telefone} />
          <Info icone={Calendar} rotulo="Enviado em" valor={new Date(t.criadoEm).toLocaleString("pt-BR")} />
        </dl>
      </motion.header>

      <Timeline etapas={etapas} />

      <Documentos />
    </motion.div>
  );
}

function etapasTriagem(t: Triagem): Etapa[] {
  const validada = t.status === "validada" || t.status === "redirecionada";
  const emUrgencia = t.status === "urgencia";
  return [
    { titulo: "Triagem online enviada", descricao: `Recebida em ${new Date(t.criadoEm).toLocaleString("pt-BR")}`, estado: "feito" },
    { titulo: emUrgencia ? "Encaminhada para urgência" : "Análise pela recepção", descricao: emUrgencia ? "Dirija-se à unidade mais próxima" : validada ? "Triagem validada pela equipe técnica" : "Aguardando validação técnica", estado: validada || emUrgencia ? "feito" : "atual" },
    { titulo: "Em atendimento médico", descricao: "Consulta com veterinário responsável", estado: validada ? "atual" : "pendente" },
    { titulo: "Alta ou retorno", descricao: "Encerramento do atendimento e orientações", estado: "pendente" },
  ];
}

// ============= Agendamento =============

function statusAg(a: Agendamento): StatusKey {
  if (a.status === "em-atendimento") return "atendimento";
  if (a.status === "concluido") return "validada";
  return "agendada";
}

function AgendamentoDetalhes({ a }: { a: Agendamento }) {
  const dt = new Date(`${a.dataISO}T${a.horario}:00`);
  const etapas: Etapa[] = [
    { titulo: "Agendamento criado", descricao: new Date(a.criadoEm).toLocaleString("pt-BR"), estado: "feito" },
    { titulo: "Confirmação", descricao: a.status === "pendente" ? "Aguardando confirmação" : "Confirmado", estado: a.status === "pendente" ? "atual" : "feito" },
    { titulo: "Check-in na unidade", descricao: "Apresente-se com 15 minutos de antecedência", estado: a.status === "check-in" || a.status === "em-atendimento" || a.status === "concluido" ? "feito" : a.status === "confirmado" ? "atual" : "pendente" },
    { titulo: "Atendimento realizado", descricao: a.status === "concluido" ? "Consulta finalizada" : "Aguardando", estado: a.status === "concluido" ? "feito" : a.status === "em-atendimento" ? "atual" : "pendente" },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-5">
      <motion.header variants={staggerItem} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-success-50 text-success-700">
              <Calendar className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs text-text-soft">Protocolo • <span className="font-mono">{a.protocolo}</span></p>
              <h1 className="font-display text-2xl font-semibold text-text-strong">{a.animalNome ?? "Consulta agendada"}</h1>
              <p className="text-sm text-muted-foreground">{a.especialidadeNome}</p>
            </div>
          </div>
          <StatusPill status={statusAg(a)} />
        </div>

        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <Info icone={Calendar} rotulo="Data e horário" valor={dt.toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short" })} />
          <Info icone={Stethoscope} rotulo="Profissional" valor={a.profissionalNome ?? "A confirmar"} />
          {a.tutorNome && <Info icone={User2} rotulo="Tutor" valor={a.tutorNome} />}
          {a.observacoes && <Info icone={ClipboardList} rotulo="Observações" valor={a.observacoes} />}
        </dl>
      </motion.header>

      <Timeline etapas={etapas} />

      <Documentos />
    </motion.div>
  );
}

// ============= UI shared =============

type Etapa = { titulo: string; descricao: string; estado: "feito" | "atual" | "pendente" };

function Timeline({ etapas }: { etapas: Etapa[] }) {
  return (
    <motion.section variants={staggerItem} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="font-display text-lg font-semibold text-text-strong">Linha do tempo</h2>
      <ol className="mt-5 space-y-4">
        {etapas.map((e, i) => {
          const Icone = e.estado === "feito" ? CheckCircle2 : e.estado === "atual" ? Loader2 : Circle;
          return (
            <li key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full border-2",
                    e.estado === "feito" && "border-success bg-success text-success-foreground",
                    e.estado === "atual" && "border-primary bg-primary-50 text-primary",
                    e.estado === "pendente" && "border-border bg-background text-text-soft",
                  )}
                >
                  <Icone className={cn("h-4 w-4", e.estado === "atual" && "animate-spin")} />
                </span>
                {i < etapas.length - 1 && (
                  <span className={cn("mt-1 h-full w-0.5 flex-1", e.estado === "feito" ? "bg-success/40" : "bg-border")} />
                )}
              </div>
              <div className="pb-4">
                <p className={cn("text-sm font-semibold", e.estado === "pendente" ? "text-text-soft" : "text-text-strong")}>
                  {e.titulo}
                </p>
                <p className="text-xs text-muted-foreground">{e.descricao}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </motion.section>
  );
}

function Documentos() {
  const baixar = (nome: string) => toast.success(`${nome} disponibilizado para download.`);
  const docs = [
    { nome: "Receituário médico", icone: FileText },
    { nome: "Resultado de exames", icone: FlaskConical },
    { nome: "Comprovante de atendimento", icone: Download },
  ];
  return (
    <motion.section variants={staggerItem} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="font-display text-lg font-semibold text-text-strong">Documentos e anexos</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Baixe seus documentos assim que forem disponibilizados pela equipe clínica.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {docs.map((d) => (
          <Button key={d.nome} variant="outline" className="justify-start" onClick={() => baixar(d.nome)}>
            <d.icone className="mr-2 h-4 w-4 text-primary" />
            {d.nome}
          </Button>
        ))}
      </div>
    </motion.section>
  );
}

function Info({ icone: Icone, rotulo, valor }: { icone: typeof PawPrint; rotulo: string; valor: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-text-soft">
        <Icone className="h-3 w-3" />
        {rotulo}
      </p>
      <p className="mt-0.5 text-sm font-medium text-text-strong">{valor}</p>
    </div>
  );
}
