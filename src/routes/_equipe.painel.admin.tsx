import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Megaphone, AlertTriangle, Clock, ArrowRight, CalendarDays, FileText, Bed, FlaskConical, GitBranchPlus, PackageX, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVitalisStore } from "@/data/store";

export const Route = createFileRoute("/_equipe/painel/admin")({
  head: () => ({ meta: [{ title: "Centro de Comando. Vitalis Belém" }] }),
  component: Admin,
});

const LEITOS_TOTAIS = 8;

const modulos = [
  { to: "/painel/agenda", titulo: "Agenda do Dia", desc: "Visualizar consultas e fluxo de atendimentos", Icon: CalendarDays },
  { to: "/painel/aguardando", titulo: "Ficha Clínica", desc: "Prontuários e histórico médico completo", Icon: FileText },
  { to: "/painel/internacoes", titulo: "Internações", desc: "Controle de leitos e monitoramento clínico", Icon: Bed },
  { to: "/painel/exames", titulo: "Solicitações de Exames", desc: "Gerencie pedidos e resultados recebidos", Icon: FlaskConical },
  { to: "/painel/encaminhamentos", titulo: "Encaminhamentos", desc: "Status de encaminhamentos internos e externos", Icon: GitBranchPlus },
];

function Admin() {
  const data = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  const { triagens, internacoes, diagnosticos } = useVitalisStore();

  const totalTriagens = triagens.length;
  const utiOcupados = internacoes.filter((i) => i.status === "critico").length;
  const utiPct = Math.round((utiOcupados / LEITOS_TOTAIS) * 100);
  const encaminhamentosExternos = diagnosticos.filter((d) => {
    const c = d.conteudo as Record<string, unknown> | undefined;
    return Boolean(c?.encaminhamento);
  }).length;

  const utiTone: "success" | "warning" | "destructive" =
    utiPct >= 80 ? "destructive" : utiPct >= 50 ? "warning" : "success";

  const cards = [
    { v: "14 min", label: "Tempo Médio de Espera", tag: "Abaixo da meta", tone: "success" as const },
    { v: String(totalTriagens), label: "Triagens Realizadas", tag: "Hoje", tone: "primary" as const },
    { v: `${utiPct}%`, label: "Taxa de Ocupação da UTI", tag: utiTone === "destructive" ? "Atenção" : utiTone === "warning" ? "Monitorar" : "Estável", tone: utiTone },
    { v: String(encaminhamentosExternos), label: "Encaminhamentos Externos", tag: "Alta complexidade", tone: "warning" as const },
  ];

  const contagem = { alta: 0, media: 0, baixa: 0 };
  for (const t of triagens) contagem[t.prioridade] = (contagem[t.prioridade] ?? 0) + 1;

  const manchester = [
    { nome: "Vermelho", desc: "Emergência", casos: 0, cor: "bg-red-500", texto: "text-red-700", fundo: "bg-red-50" },
    { nome: "Laranja", desc: "Muito Urgente", casos: contagem.alta, cor: "bg-orange-500", texto: "text-orange-700", fundo: "bg-orange-50" },
    { nome: "Amarelo", desc: "Urgente", casos: contagem.media, cor: "bg-yellow-500", texto: "text-yellow-700", fundo: "bg-yellow-50" },
    { nome: "Verde", desc: "Pouco Urgente", casos: contagem.baixa, cor: "bg-green-500", texto: "text-green-700", fundo: "bg-green-50" },
    { nome: "Azul", desc: "Não Urgente", casos: 0, cor: "bg-blue-500", texto: "text-blue-700", fundo: "bg-blue-50" },
  ];
  const totalManchester = manchester.reduce((s, m) => s + m.casos, 0) || 1;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Centro de Comando
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Diretoria · Hospital Veterinário Municipal · {data}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-success-700">
            <span className="h-2 w-2 rounded-full bg-success" /> Sistema Online
          </p>
          <p className="mt-1.5 text-sm text-text-strong">
            Hoje foram realizadas <strong>{totalTriagens}</strong> triagens, com <strong>{encaminhamentosExternos}</strong> encaminhamentos externos e UTI a <strong>{utiPct}%</strong>.
          </p>
        </div>
      </div>

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Centro de Comando
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Diretoria · Hospital Veterinário Municipal · {data}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-success-700">
            <span className="h-2 w-2 rounded-full bg-success" /> Sistema Online
          </p>
          <p className="mt-1.5 text-sm text-text-strong">
            Hoje foram realizadas <strong>142</strong> triagens, com <strong>12</strong> encaminhamentos externos e UTI a <strong>85%</strong>.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => {
          const cor =
            c.tone === "primary" ? "text-primary border-primary/10"
              : c.tone === "success" ? "text-success-700 border-success/20"
              : c.tone === "destructive" ? "text-destructive border-destructive/20"
              : c.tone === "warning" ? "text-warning-700 border-warning/20"
              : "text-muted-foreground border-border";
          const pillCor =
            c.tone === "primary" ? "bg-primary-50 text-primary-800"
              : c.tone === "success" ? "bg-success-50 text-success-700"
              : c.tone === "destructive" ? "bg-destructive-50 text-destructive"
              : c.tone === "warning" ? "bg-warning-50 text-warning-700"
              : "bg-muted text-muted-foreground";
          return (
            <div key={c.label} className={cn("rounded-2xl border bg-surface p-4 shadow-sm", cor)}>
              <p className="text-xs text-text-soft">{c.label}</p>
              <p className={cn("mt-1.5 font-display text-3xl font-bold", cor)}>{c.v}</p>
              <span className={cn("mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold", pillCor)}>{c.tag}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight text-text-strong">Eficiência de Triagem (SLA)</h2>
                <p className="mt-1 text-xs text-muted-foreground">Distribuição de casos por Protocolo de Manchester · {totalManchester} triagens hoje</p>
              </div>
              <TrendingUp className="h-4 w-4 text-text-soft" />
            </div>
            <div className="mt-4 space-y-2.5 rounded-2xl border border-border bg-surface p-5 shadow-sm">
              {manchester.map((m) => {
                const pct = Math.round((m.casos / totalManchester) * 100);
                return (
                  <div key={m.nome} className="flex items-center gap-3">
                    <div className="flex w-32 shrink-0 items-center gap-2">
                      <span className={cn("h-3 w-3 rounded-full", m.cor)} />
                      <div>
                        <p className="text-xs font-semibold text-text-strong">{m.nome}</p>
                        <p className="text-[10px] text-text-soft">{m.desc}</p>
                      </div>
                    </div>
                    <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-muted">
                      <div className={cn("h-full rounded-md transition-all", m.cor)} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-20 shrink-0 text-right">
                      <p className={cn("font-mono text-sm font-semibold", m.texto)}>{m.casos}</p>
                      <p className="text-[10px] text-text-soft">{pct}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold tracking-tight text-text-strong">Módulos Administrativos</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {modulos.map((m) => {
                const Icone = m.Icon;
                return (
                  <Link
                    key={m.to}
                    to={m.to}
                    className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary">
                      <Icone className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-semibold text-text-strong">{m.titulo}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
                    <ArrowRight className="mt-3 h-4 w-4 text-text-soft transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                );
              })}
            </div>
            <Button variant="destructive" size="lg" className="mt-6">
              <AlertTriangle className="mr-2 h-4 w-4" /> Nova Emergência
            </Button>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-strong">
              <Megaphone className="h-4 w-4 text-primary" /> Controle de Suprimentos
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">Baixas registradas na UTI hoje · rastreio de recursos públicos</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li className="rounded-lg bg-destructive-50/60 p-3">
                <p className="inline-flex items-center gap-1.5 font-semibold text-destructive">
                  <PackageX className="h-3.5 w-3.5" /> Estoque crítico
                </p>
                <p className="mt-1 text-xs text-text-strong">Seringa 10ml — restam <strong>40 unid.</strong></p>
                <p className="mt-0.5 text-[10px] text-text-soft">Reposição sugerida em 24h</p>
              </li>
              <li className="rounded-lg bg-warning-50/60 p-3">
                <p className="inline-flex items-center gap-1.5 font-semibold text-warning-700">
                  <TrendingUp className="h-3.5 w-3.5" /> Alto consumo
                </p>
                <p className="mt-1 text-xs text-text-strong">Dipirona Injetável — <strong>50 ampolas</strong> hoje</p>
                <p className="mt-0.5 text-[10px] text-text-soft">+38% vs. média semanal</p>
              </li>
              <li className="rounded-lg bg-warning-50/60 p-3">
                <p className="inline-flex items-center gap-1.5 font-semibold text-warning-700">
                  <Clock className="h-3.5 w-3.5" /> Baixa acelerada
                </p>
                <p className="mt-1 text-xs text-text-strong">Soro Fisiológico 500ml — <strong>18 bolsas</strong> na UTI</p>
                <p className="mt-0.5 text-[10px] text-text-soft">Custo estimado: R$ 126,00</p>
              </li>
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link to="/painel/estoque">Ver almoxarifado <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
