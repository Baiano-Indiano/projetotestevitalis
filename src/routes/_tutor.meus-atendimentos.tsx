import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useVitalisStore } from "@/data/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatusPill, type StatusKey } from "@/components/StatusPill";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { nomeEspecialidade } from "@/config/municipio";
import { PawPrint, Calendar, ArrowRight, ClipboardList, Stethoscope, Clock } from "lucide-react";
import type { Triagem, Agendamento } from "@/data/types";

export const Route = createFileRoute("/_tutor/meus-atendimentos")({
  head: () => ({
    meta: [
      { title: "Meus atendimentos. Vitalis Belém" },
      {
        name: "description",
        content:
          "Acompanhe suas triagens, agendamentos e orientações veterinárias na rede pública municipal de Belém.",
      },
      { property: "og:title", content: "Meus atendimentos — Vitalis Belém" },
      { property: "og:description", content: "Histórico de triagens e agendamentos vinculado ao seu cadastro municipal." },
      { property: "og:url", content: "https://projetotestevitalis.lovable.app/meus-atendimentos" },
    ],
    links: [{ rel: "canonical", href: "https://projetotestevitalis.lovable.app/meus-atendimentos" }],
  }),
  component: MeusAtendimentos,
});

type Item =
  | { kind: "triagem"; id: string; data: string; ordenar: number; triagem: Triagem; ativo: boolean }
  | { kind: "agendamento"; id: string; data: string; ordenar: number; agendamento: Agendamento; ativo: boolean };

function MeusAtendimentos() {
  const { triagens, agendamentos } = useVitalisStore();

  const { emAndamento, historico } = useMemo(() => {
    const itens: Item[] = [
      ...triagens.map<Item>((t) => ({
        kind: "triagem",
        id: t.id,
        data: t.criadoEm,
        ordenar: new Date(t.criadoEm).getTime(),
        triagem: t,
        ativo: t.status === "pendente" || t.status === "urgencia",
      })),
      ...agendamentos.map<Item>((a) => ({
        kind: "agendamento",
        id: a.id,
        data: a.criadoEm,
        ordenar: new Date(`${a.dataISO}T${a.horario}:00`).getTime(),
        agendamento: a,
        ativo: a.status !== "concluido" && a.status !== "cancelado" && a.status !== "falta",
      })),
    ].sort((x, y) => y.ordenar - x.ordenar);

    return {
      emAndamento: itens.filter((i) => i.ativo),
      historico: itens.filter((i) => !i.ativo),
    };
  }, [triagens, agendamentos]);

  return (
    <div className="container-app py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-soft">Portal do tutor</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-text-strong">
            Meus atendimentos
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acompanhe suas triagens, agendamentos e o andamento clínico do seu pet na rede Vitalis.
          </p>
        </div>

        <Tabs defaultValue="andamento" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="andamento">
              Em andamento
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {emAndamento.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="historico">
              Histórico
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {historico.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="andamento" className="mt-6">
            <Lista itens={emAndamento} vazio="Nenhum atendimento em andamento no momento." />
          </TabsContent>
          <TabsContent value="historico" className="mt-6">
            <Lista itens={historico} vazio="Ainda não há atendimentos finalizados." />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Lista({ itens, vazio }: { itens: Item[]; vazio: string }) {
  if (itens.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
        <ClipboardList className="mx-auto h-8 w-8 text-text-soft" />
        <p className="mt-3 text-sm text-muted-foreground">{vazio}</p>
        <Button asChild className="mt-5">
          <Link to="/triagem">Iniciar nova triagem</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-3"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {itens.map((i) => (
        <motion.div key={`${i.kind}-${i.id}`} variants={staggerItem}>
          {i.kind === "triagem" ? <CardTriagem t={i.triagem} /> : <CardAgendamento a={i.agendamento} />}
        </motion.div>
      ))}
    </motion.div>
  );
}

function statusTriagem(t: Triagem): StatusKey {
  if (t.status === "urgencia") return "urgencia";
  if (t.status === "validada") return "validada";
  if (t.status === "redirecionada") return "redirecionada";
  return "aguardando";
}

function statusAgendamento(a: Agendamento): StatusKey {
  if (a.status === "em-atendimento") return "atendimento";
  if (a.status === "concluido") return "validada";
  return "agendada";
}

function CardTriagem({ t }: { t: Triagem }) {
  return (
    <article className="group rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-50 text-primary">
            <PawPrint className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-text-soft">Triagem • {t.protocolo}</p>
            <h3 className="font-display text-lg font-semibold text-text-strong">{t.animal.nome}</h3>
          </div>
        </div>
        <StatusPill status={statusTriagem(t)} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Info icone={Stethoscope} rotulo="Especialidade" valor={t.sugestao === "urgencia" ? "Urgência" : nomeEspecialidade(t.sugestao)} />
        <Info icone={Clock} rotulo="Enviado em" valor={new Date(t.criadoEm).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })} />
      </dl>

      <div className="mt-4 flex justify-end">
        <Button asChild size="sm" variant="outline">
          <Link to="/atendimento/$id" params={{ id: t.id }}>
            Ver detalhes <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function CardAgendamento({ a }: { a: Agendamento }) {
  const data = new Date(`${a.dataISO}T${a.horario}:00`);
  return (
    <article className="group rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-success-50 text-success-700">
            <Calendar className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-text-soft">Agendamento • {a.protocolo}</p>
            <h3 className="font-display text-lg font-semibold text-text-strong">
              {a.animalNome ?? "Consulta"}
            </h3>
          </div>
        </div>
        <StatusPill status={statusAgendamento(a)} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Info icone={Stethoscope} rotulo="Especialidade" valor={a.especialidadeNome} />
        <Info icone={Calendar} rotulo="Data" valor={data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })} />
      </dl>

      <div className="mt-4 flex justify-end">
        <Button asChild size="sm" variant="outline">
          <Link to="/atendimento/$id" params={{ id: a.id }}>
            Ver detalhes <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </article>
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
