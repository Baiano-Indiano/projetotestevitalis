import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  Wifi,
  Stethoscope,
  UserSquare2,
  CalendarDays,
  ArrowRight,
  Bed,
  FileText,
  FlaskConical,
  GitBranchPlus,
  ShieldCheck,
  Syringe,
  TestTube2,
  Cpu,
  ClipboardList,
  Search,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useVitalisStore } from "@/data/store";

export const Route = createFileRoute("/_equipe/painel/")({
  head: () => ({ meta: [{ title: "Painel. Vitalis Belém" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    tab: typeof s.tab === "string" ? s.tab : undefined,
  }),
  component: PainelHome,
});

function PainelHome() {
  const { papel } = useVitalisStore();
  const { tab } = Route.useSearch();
  if (papel === "veterinario") return <PainelVeterinario />;
  if (papel === "unidade_movel") {
    if (tab && tab !== "dashboard") return <PainelUnidadeMovelTab tab={tab} />;
    return <PainelUnidadeMovel />;
  }
  return <PainelRecepcao />;
}

function PainelUnidadeMovelTab({ tab }: { tab: string }) {
  const titulos: Record<string, { titulo: string; desc: string; Icon: typeof Syringe }> = {
    triagem: { titulo: "Triagens da Unidade", desc: "Triagens realizadas em campo nesta unidade móvel.", Icon: ClipboardList },
    vacinacao: { titulo: "Vacinas Aplicadas", desc: "Histórico de doses aplicadas durante as ações de campo.", Icon: Syringe },
    coletas: { titulo: "Coletas Realizadas", desc: "Coletas de sangue e amostras realizadas em campo.", Icon: TestTube2 },
    microchip: { titulo: "Microchipagem", desc: "Animais identificados com microchip nesta unidade.", Icon: Cpu },
  };
  const info = titulos[tab] ?? titulos.triagem;
  const I = info.Icon;
  const linhas = [
    { hora: "08:30", paciente: "Bidu", tutor: "Maria Souza", detalhe: tab === "vacinacao" ? "V10 - Lote 4521" : tab === "coletas" ? "Sangue - Hemograma" : tab === "microchip" ? "Chip 9821..." : "Triagem inicial" },
    { hora: "09:15", paciente: "Luna", tutor: "João Lima", detalhe: tab === "vacinacao" ? "Antirrábica - Lote 8812" : tab === "coletas" ? "Urina" : tab === "microchip" ? "Chip 9822..." : "Triagem rotina" },
    { hora: "10:00", paciente: "Thor", tutor: "Ana Paula", detalhe: tab === "vacinacao" ? "V8 - Lote 7710" : tab === "coletas" ? "Fezes" : tab === "microchip" ? "Chip 9823..." : "Reavaliação" },
  ];
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-700"><I className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-text-strong md:text-3xl">{info.titulo}</h1>
          <p className="text-sm text-muted-foreground">{info.desc}</p>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-display text-base font-semibold text-text-strong">Registros do dia</h3>
          <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Novo registro</Button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-text-soft">
              <th className="px-5 py-3">Horário</th>
              <th className="px-5 py-3">Paciente</th>
              <th className="px-5 py-3">Tutor</th>
              <th className="px-5 py-3">Detalhe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {linhas.map((l) => (
              <tr key={l.hora} className="hover:bg-muted/40">
                <td className="px-5 py-3 font-medium text-text-strong">{l.hora}</td>
                <td className="px-5 py-3 text-text-strong">{l.paciente}</td>
                <td className="px-5 py-3 text-muted-foreground">{l.tutor}</td>
                <td className="px-5 py-3 text-text-strong">{l.detalhe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PainelRecepcao() {
  const { triagens } = useVitalisStore();
  const pendentes = triagens.filter((t) => t.status === "pendente" || t.status === "urgencia").length;
  const triagensHoje = triagens.length + 22;

  const data = new Date();
  const dataFmt = data.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const horaFmt = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const stats = [
    { label: "Pacientes Aguardando", valor: pendentes, cor: "text-primary" },
    { label: "Triagens Online (hoje)", valor: triagensHoje, cor: "text-success-700" },
    { label: "Veterinários Disponíveis", valor: 5, cor: "text-primary" },
    { label: "Em Atendimento", valor: 8, cor: "text-text-strong" },
    { label: "Agendamentos do Dia", valor: 45, cor: "text-primary" },
  ];

  const modulos = [
    { to: "/painel/aguardando", titulo: "Pacientes Aguardando", desc: "Fila presencial e online", Icon: Users, badge: `${pendentes} na fila` },
    { to: "/painel/triagens", titulo: "Triagens Online", desc: "Triagens recebidas para encaminhamento", Icon: Wifi, badge: "5" },
    { to: "/painel/em-atendimento", titulo: "Em Atendimento", desc: "Acompanhar o fluxo atual", Icon: UserSquare2, badge: "8" },
    { to: "/painel/agenda", titulo: "Agendamentos", desc: "Gestão da agenda e retornos", Icon: CalendarDays },
    { to: "/painel/internacoes", titulo: "Internações", desc: "Leitos ativos e ocupação", Icon: Bed },
    { to: "/painel/veterinarios", titulo: "Veterinários", desc: "Disponibilidade operacional", Icon: Stethoscope, badge: "5 ativos" },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Painel da Recepção
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão operacional do atendimento. Organize a fila e o fluxo de pacientes.
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="font-medium capitalize text-primary-700">{dataFmt} às {horaFmt}</p>
          <p className="text-xs text-text-soft">Recepção: Ana Silva</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">{s.label}</p>
            <p className={`mt-3 font-display text-3xl font-bold ${s.cor}`}>{s.valor}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {modulos.map((m) => {
          const Icone = m.Icon;
          return (
            <Link
              key={m.to}
              to={m.to}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary">
                  <Icone className="h-5 w-5" />
                </span>
                {"badge" in m && m.badge && (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                    {m.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-text-strong">{m.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-text-soft transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function PainelVeterinario() {
  const data = new Date();
  const dataFmt = data.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const horaFmt = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const stats = [
    { label: "Pacientes em Atendimento", valor: 3, cor: "text-primary" },
    { label: "Consultas do Dia", valor: 12, cor: "text-text-strong" },
    { label: "Exames Pendentes", valor: 4, cor: "text-warning-700" },
    { label: "Encaminhamentos", valor: 2, cor: "text-primary" },
    { label: "Validações Pendentes", valor: 5, cor: "text-destructive" },
  ];

  const modulos = [
    { to: "/painel/em-atendimento", titulo: "Pacientes em Atendimento", desc: "Continue consultas em andamento", Icon: UserSquare2, badge: "3" },
    { to: "/painel/ficha/$id", params: { id: "novo" }, titulo: "Prontuários", desc: "Anamnese, evolução e prescrição", Icon: FileText },
    { to: "/painel/exames", titulo: "Solicitações de Exames", desc: "Requisições e resultados", Icon: FlaskConical, badge: "4" },
    { to: "/painel/encaminhamentos", titulo: "Encaminhamentos", desc: "Acompanhar especialidades", Icon: GitBranchPlus, badge: "2" },
    { to: "/painel/validacao", titulo: "Validação Clínica", desc: "Triagens aguardando parecer", Icon: ShieldCheck, badge: "5" },
    { to: "/painel/agenda", titulo: "Agenda do Veterinário", desc: "Consultas e retornos do dia", Icon: CalendarDays },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Painel do Veterinário
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe seus pacientes, prontuários e atividades clínicas do dia.
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="font-medium capitalize text-primary-700">{dataFmt} às {horaFmt}</p>
          <p className="text-xs text-text-soft">Dr. Ricardo Silva</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">{s.label}</p>
            <p className={`mt-3 font-display text-3xl font-bold ${s.cor}`}>{s.valor}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {modulos.map((m) => {
          const Icone = m.Icon;
          const linkProps = "params" in m
            ? { to: m.to as never, params: m.params as never }
            : { to: m.to as never };
          return (
            <Link
              key={m.titulo}
              {...linkProps}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary">
                  <Icone className="h-5 w-5" />
                </span>
                {"badge" in m && m.badge && (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                    {m.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-text-strong">{m.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-text-soft transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Painel Unidade Móvel
// ============================================================

type StatusAgendaUM = "Concluido" | "Em atendimento" | "Agendado";

const agendaUM: { hora: string; paciente: string; especie: string; raca: string; procedimento: string; status: StatusAgendaUM }[] = [
  { hora: "08:30", paciente: "Bidu", especie: "Canina", raca: "SRD", procedimento: "Vacinação (V10)", status: "Concluido" },
  { hora: "09:15", paciente: "Luna", especie: "Felina", raca: "Siamês", procedimento: "Triagem", status: "Em atendimento" },
  { hora: "10:00", paciente: "Thor", especie: "Canina", raca: "Pitbull", procedimento: "Coleta de Sangue", status: "Agendado" },
  { hora: "10:45", paciente: "Mia", especie: "Felina", raca: "SRD", procedimento: "Microchipagem", status: "Agendado" },
];

const statusPillUM: Record<StatusAgendaUM, string> = {
  Concluido: "bg-success-50 text-success-700 border-success-200",
  "Em atendimento": "bg-primary-50 text-primary-800 border-primary-200",
  Agendado: "bg-muted text-muted-foreground border-border",
};

function PainelUnidadeMovel() {
  const [unidade, setUnidade] = useState("um-01");
  const [busca, setBusca] = useState("");
  const [selecionada, setSelecionada] = useState("Luna");

  const kpis = [
    { label: "Atendimentos Hoje", valor: 24, Icon: Users, bg: "bg-primary-50", fg: "text-primary" },
    { label: "Triagens", valor: 12, Icon: ClipboardList, bg: "bg-success-50", fg: "text-success-700" },
    { label: "Vacinas", valor: 45, Icon: Syringe, bg: "bg-primary-50", fg: "text-primary-700" },
    { label: "Coletas", valor: 8, Icon: TestTube2, bg: "bg-muted", fg: "text-text-strong" },
    { label: "Microchips", valor: 15, Icon: Cpu, bg: "bg-success-50", fg: "text-success-700" },
    { label: "Encaminhamentos", valor: 3, Icon: GitBranchPlus, bg: "bg-destructive/10", fg: "text-destructive" },
  ];

  const filtrada = agendaUM.filter((a) =>
    busca.trim() === "" ? true : a.paciente.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-text-strong md:text-3xl">
            Unidade Móvel 01 — Belém/Nazaré
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success-200 bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Em atendimento
          </span>
        </div>
        <Select value={unidade} onValueChange={setUnidade}>
          <SelectTrigger className="w-[280px] bg-surface">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="um-01">Unidade Móvel 01 - Nazaré</SelectItem>
            <SelectItem value="um-02">Unidade Móvel 02 - Batista Campos</SelectItem>
            <SelectItem value="um-03">Unidade Móvel 03 - Pedreira</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => {
          const I = k.Icon;
          return (
            <div key={k.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <span className={cn("grid h-10 w-10 place-items-center rounded-xl", k.bg, k.fg)}>
                <I className="h-5 w-5" />
              </span>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-text-soft">{k.label}</p>
              <p className="mt-1 font-display text-2xl font-bold text-text-strong">{String(k.valor).padStart(2, "0")}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-text-strong">Ações Rápidas</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button><Plus className="mr-1 h-4 w-4" /> Nova Triagem</Button>
              <Button variant="outline"><Plus className="mr-1 h-4 w-4" /> Nova Vacinação</Button>
              <Button variant="outline"><Plus className="mr-1 h-4 w-4" /> Nova Coleta</Button>
              <Button variant="outline"><Plus className="mr-1 h-4 w-4" /> Novo Microchip</Button>
              <Button variant="outline"><Plus className="mr-1 h-4 w-4" /> Novo Encaminhamento</Button>
              <Button className="bg-success-600 text-white hover:bg-success-700"><Plus className="mr-1 h-4 w-4" /> Novo Atendimento</Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <h3 className="font-display text-lg font-semibold text-text-strong">Agenda do Dia</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="w-64 pl-9"
                    placeholder="Buscar paciente..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">Filtros</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-text-soft">
                    <th className="px-5 py-3">Horário</th>
                    <th className="px-5 py-3">Paciente</th>
                    <th className="px-5 py-3">Procedimento</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtrada.map((a) => {
                    const ativa = a.paciente === selecionada;
                    return (
                      <tr
                        key={a.hora}
                        onClick={() => setSelecionada(a.paciente)}
                        className={cn("cursor-pointer transition-colors", ativa ? "bg-primary-50" : "hover:bg-muted/40")}
                      >
                        <td className="px-5 py-3 font-medium text-text-strong">{a.hora}</td>
                        <td className="px-5 py-3">
                          <p className="font-medium text-text-strong">{a.paciente}</p>
                          <p className="text-xs text-text-soft">{a.especie} · {a.raca}</p>
                        </td>
                        <td className="px-5 py-3 text-text-strong">{a.procedimento}</td>
                        <td className="px-5 py-3">
                          <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", statusPillUM[a.status])}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h3 className="font-display text-lg font-semibold text-text-strong">Informações da Unidade</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <InfoUM k="Equipe ID" v="VET-MÓVEL-01A" />
            <InfoUM k="Veterinário plantonista" v="Dra. Ana Paula" />
            <InfoUM k="Motorista" v="João Silva" />
            <InfoUM k="Área de atuação hoje" v="Nazaré / Batista Campos" />
            <InfoUM k="Horário de operação" v="08:00 - 17:00" />
          </dl>
        </aside>
      </div>
    </div>
  );
}

function InfoUM({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">{k}</dt>
      <dd className="mt-0.5 font-medium text-text-strong">{v}</dd>
    </div>
  );
}
