import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  CalendarDays,
  GitBranchPlus,
  Syringe,
  TestTube2,
  Cpu,
  ClipboardList,
  Search,
  Plus,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SyncIndicator } from "@/components/SyncIndicator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/unidade-movel")({
  head: () => ({ meta: [{ title: "Unidade Móvel. Vitalis Belém" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    tab: typeof s.tab === "string" ? s.tab : undefined,
  }),
  component: UnidadeMovelRoute,
});

type Aba = "dashboard" | "triagem" | "vacinacao" | "coletas" | "microchip";

const abas: { id: Aba; label: string; Icon: typeof LayoutGrid }[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutGrid },
  { id: "triagem", label: "Triagem", Icon: ClipboardList },
  { id: "vacinacao", label: "Vacinação", Icon: Syringe },
  { id: "coletas", label: "Coletas", Icon: TestTube2 },
  { id: "microchip", label: "Microchipagem", Icon: Cpu },
];

function UnidadeMovelRoute() {
  const { tab } = Route.useSearch();
  const ativa: Aba = (abas.find((a) => a.id === tab)?.id ?? "dashboard") as Aba;
  const navigate = Route.useNavigate();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-text-strong md:text-3xl">
          Unidade Móvel
        </h1>
        <SyncIndicator />
      </div>

      <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-border bg-surface p-1 shadow-sm">
        {abas.map((a) => {
          const I = a.Icon;
          const isActive = a.id === ativa;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() =>
                navigate({ search: a.id === "dashboard" ? {} : { tab: a.id } })
              }
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-800"
                  : "text-muted-foreground hover:bg-muted hover:text-text-strong",
              )}
            >
              <I className="h-4 w-4" /> {a.label}
            </button>
          );
        })}
      </div>

      {ativa === "dashboard" ? <Dashboard /> : <ListaAba tab={ativa} />}
    </div>
  );
}

function ListaAba({ tab }: { tab: Exclude<Aba, "dashboard"> }) {
  const titulos: Record<Exclude<Aba, "dashboard">, { titulo: string; desc: string; Icon: typeof Syringe }> = {
    triagem: { titulo: "Triagens da Unidade", desc: "Triagens realizadas em campo nesta unidade móvel.", Icon: ClipboardList },
    vacinacao: { titulo: "Vacinas Aplicadas", desc: "Histórico de doses aplicadas durante as ações de campo.", Icon: Syringe },
    coletas: { titulo: "Coletas Realizadas", desc: "Coletas de sangue e amostras realizadas em campo.", Icon: TestTube2 },
    microchip: { titulo: "Microchipagem", desc: "Animais identificados com microchip nesta unidade.", Icon: Cpu },
  };
  const info = titulos[tab];
  const I = info.Icon;
  const linhas = [
    { hora: "08:30", paciente: "Bidu", tutor: "Maria Souza", detalhe: tab === "vacinacao" ? "V10 - Lote 4521" : tab === "coletas" ? "Sangue - Hemograma" : tab === "microchip" ? "Chip 9821..." : "Triagem inicial" },
    { hora: "09:15", paciente: "Luna", tutor: "João Lima", detalhe: tab === "vacinacao" ? "Antirrábica - Lote 8812" : tab === "coletas" ? "Urina" : tab === "microchip" ? "Chip 9822..." : "Triagem rotina" },
    { hora: "10:00", paciente: "Thor", tutor: "Ana Paula", detalhe: tab === "vacinacao" ? "V8 - Lote 7710" : tab === "coletas" ? "Fezes" : tab === "microchip" ? "Chip 9823..." : "Reavaliação" },
  ];
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-700"><I className="h-5 w-5" /></span>
        <div>
          <h2 className="font-display text-xl font-semibold text-text-strong">{info.titulo}</h2>
          <p className="text-sm text-muted-foreground">{info.desc}</p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-border bg-surface shadow-sm">
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

function Dashboard() {
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
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-strong">
            Unidade Móvel 01 — Belém/Nazaré
          </h2>
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
