import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { municipio } from "@/config/municipio";
import {
  ArrowRight,
  CalendarCheck,
  ShieldCheck,
  Stethoscope,
  AlertTriangle,
  Filter,
  Zap,
  Clock,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { revealVariants, staggerContainer, staggerItem } from "@/lib/motion";

export const Route = createFileRoute("/_tutor/")({
  head: () => ({
    meta: [
      { title: "Hospital Veterinário Público | Vitalis Belém" },
      { name: "description", content: "Triagem online gratuita e atendimento veterinário na rede municipal de Belém. Reduza filas e priorize quem precisa de cuidado urgente." },
      { property: "og:title", content: "Vitalis Belém. Saúde veterinária pública" },
      { property: "og:description", content: "Triagem online gratuita e atendimento na rede veterinária de Belém." },
      { property: "og:url", content: "https://projetotestevitalis.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://projetotestevitalis.lovable.app/" }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[radial-gradient(ellipse_at_top,var(--color-primary-50)_0%,var(--color-background)_60%)] pb-10 pt-8 md:pb-16 md:pt-14">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center md:text-left">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Serviço Público Municipal
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-text-strong md:text-5xl">
              Atendimento Veterinário Público Mais <span className="text-primary">Organizado</span> e <span className="text-success-700">Acessível</span>
            </h1>
            <p className="mt-4 text-sm text-muted-foreground md:text-base">
              Reduzimos filas e facilitamos o acesso à saúde do seu pet. Um sistema inteligente para garantir que quem precisa de cuidado urgente seja atendido com prioridade.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:max-w-md sm:mx-auto md:mx-0">
              <Button asChild size="lg">
                <Link to="/triagem">
                  <Filter className="mr-2 h-4 w-4" /> Fazer Triagem
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
                <Link to="/agendar">
                  <CalendarCheck className="mr-2 h-4 w-4" /> Agendar Atendimento
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Entenda nossas unidades */}
      <motion.section
        className="container-app py-10 md:py-14"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={revealVariants}
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text-strong md:text-3xl">
            Entenda Nossas Unidades
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Saiba para onde levar seu pet dependendo da necessidade.
          </p>
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary">
              <Plus className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-primary">Clínica Municipal</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Focada em atendimentos de baixa e média complexidade, consultas de rotina e prevenção.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-text-strong">
              <Item ok>Consultas de rotina</Item>
              <Item ok>Vacinação básica</Item>
              <Item ok>Casos não urgentes</Item>
            </ul>
          </div>

          <div className="rounded-2xl border-l-4 border-l-destructive border-y border-r border-y-border border-r-border bg-surface p-5 shadow-sm">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-destructive-50 text-destructive">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-destructive">Hospital Veterinário</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Estrutura completa para urgências, emergências, cirurgias e casos de alta complexidade.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-text-strong">
              <Item alerta>Urgências e Emergências</Item>
              <Item alerta>Cirurgias complexas</Item>
              <Item alerta>Internação</Item>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Benefícios */}
      <motion.section
        className="container-app pb-10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
          {[
            { Icon: Filter, t: "Menos Filas", d: "Sistema inteligente que organiza o fluxo e reduz o tempo de espera nas unidades." },
            { Icon: AlertTriangle, t: "Priorização de Urgências", d: "Casos graves são identificados rapidamente e encaminhados para atendimento imediato." },
            { Icon: Zap, t: "Informação Rápida", d: "Saiba exatamente o que fazer e para onde ir antes mesmo de sair de casa." },
          ].map((b) => {
            const Icone = b.Icon;
            return (
              <motion.div key={b.t} className="text-center" variants={staggerItem}>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-primary">
                  <Icone className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-display text-base font-semibold text-text-strong">{b.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Como funciona */}
      <motion.section
        className="border-t border-border bg-surface/60 py-12 md:py-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-text-strong md:text-3xl">
              Como Funciona
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Um processo simples em três etapas para garantir o melhor cuidado.
            </p>
          </div>
          <div className="mx-auto mt-7 grid max-w-3xl gap-4 md:grid-cols-3">
            {[
              { n: 1, t: "Triagem Online", d: "Responda a um breve questionário sobre os sintomas do seu animal." },
              { n: 2, t: "Orientação", d: "Receba a indicação imediata se é um caso de clínica ou emergência hospitalar." },
              { n: 3, t: "Agendamento", d: "Para casos não urgentes, agende o melhor horário na unidade indicada." },
            ].map((s) => (
              <motion.div key={s.n} className="rounded-2xl border border-border bg-background p-5 text-center shadow-sm" variants={staggerItem}>
                <span className={cn(
                  "mx-auto grid h-10 w-10 place-items-center rounded-full font-bold text-white",
                  s.n === 1 ? "bg-primary" : s.n === 2 ? "bg-success" : "bg-primary-700",
                )}>
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-base font-semibold text-text-strong">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </motion.div>
            ))}
          </div>

          <div className="mx-auto mt-7 max-w-md">
            <Button asChild size="lg" className="w-full">
              <Link to="/triagem">
                Iniciar Triagem Agora <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Unidades */}
      <motion.section
        className="container-app py-12 md:py-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text-strong md:text-3xl">
            Rede {municipio.nomeRede}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{municipio.unidades.length} unidades em {municipio.cidade}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {municipio.unidades.map((u) => (
            <motion.div key={u.id} className="rounded-2xl border border-border bg-surface p-4 shadow-sm" variants={staggerItem}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-soft">
                  {u.tipo === "movel" ? "Móvel" : u.tipo === "hospital" ? "Hospital" : "Clínica"}
                </span>
                {u.atendimento24h && <span className="rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-semibold text-success-700">24h</span>}
              </div>
              <h3 className="mt-2 font-display text-sm font-semibold text-text-strong">{u.nome}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{u.endereco}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </>
  );
}

function Item({ children, ok, alerta }: { children: React.ReactNode; ok?: boolean; alerta?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      <span className={cn(
        "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
        ok && "bg-success/10 text-success-700",
        alerta && "bg-destructive/10 text-destructive",
      )}>
        {ok ? "✓" : "▲"}
      </span>
      <span className="text-sm">{children}</span>
    </li>
  );
}
