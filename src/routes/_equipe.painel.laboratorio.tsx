import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  FlaskConical,
  TestTube2,
  CheckCircle2,
  FileText,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/laboratorio")({
  head: () => ({ meta: [{ title: "Laboratório. Vitalis Belém" }] }),
  component: Laboratorio,
});

interface ExameLab {
  id: string;
  paciente: string;
  especie: string;
  raca: string;
  exame: string;
  coleta: string;
  hora: string;
  status: "Em análise" | "Aguardando coleta" | "Concluído";
}

const exames: ExameLab[] = [
  { id: "EXM-4101", paciente: "Thor", especie: "Cão", raca: "Golden Retriever", exame: "Hemograma Completo", coleta: "24/10/2023 08:30", hora: "09:15", status: "Em análise" },
  { id: "EXM-4102", paciente: "Mia", especie: "Gato", raca: "SRD", exame: "Perfil Renal", coleta: "24/10/2023 08:45", hora: "09:20", status: "Em análise" },
  { id: "EXM-4103", paciente: "Bento", especie: "Cão", raca: "Labrador", exame: "Bioquímica Hepática", coleta: "24/10/2023 09:00", hora: "09:50", status: "Em análise" },
  { id: "EXM-4104", paciente: "Pituca", especie: "Gato", raca: "Persa", exame: "Glicemia", coleta: "24/10/2023 09:30", hora: "10:10", status: "Em análise" },
];

const parametros = [
  { p: "Eritrócitos", r: "6,8 milhões/µL", ref: "5,5 - 8,5 milhões/µL" },
  { p: "Hemoglobina", r: "16,2 g/dL", ref: "12,0 - 18,0 g/dL" },
  { p: "Hematócrito", r: "48 %", ref: "37 - 55 %" },
  { p: "VCM", r: "70 fL", ref: "60 - 77 fL" },
  { p: "CHCM", r: "33,5 g/dL", ref: "32 - 36 g/dL" },
];

const stats = [
  { label: "Em Análise", valor: 18, Icon: FlaskConical, tone: "bg-warning-50 text-warning-700" },
  { label: "Aguardando Coleta", valor: 7, Icon: TestTube2, tone: "bg-primary-50 text-primary-700" },
  { label: "Concluídos Hoje", valor: 32, Icon: CheckCircle2, tone: "bg-success-50 text-success-700" },
  { label: "Laudos Finalizados", valor: 28, Icon: FileText, tone: "bg-muted text-text-strong" },
];

function Laboratorio() {
  const [busca, setBusca] = useState("");
  const [selId, setSelId] = useState(exames[0].id);
  const [aba, setAba] = useState<"resultados" | "info">("resultados");
  const [laudo, setLaudo] = useState(
    "Eritrograma dentro dos limites de normalidade para a espécie. Não foram observadas alterações morfológicas significativas nas hemácias. Hemoglobina e hematócrito compatíveis com perfusão tecidual adequada. Recomenda-se correlação com a clínica do paciente.",
  );
  const filtrados = useMemo(
    () => exames.filter((e) => `${e.paciente} ${e.exame}`.toLowerCase().includes(busca.toLowerCase())),
    [busca],
  );
  const sel = exames.find((e) => e.id === selId) ?? exames[0];

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Laboratório
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Emissão de laudos laboratoriais</p>
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

      <div className="mt-6 grid gap-4 xl:grid-cols-[320px_1fr_380px]">
        {/* Coluna 1 — Exames em Análise */}
        <aside className="rounded-2xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border p-4">
            <h3 className="font-display text-sm font-semibold text-text-strong">Exames em Análise</h3>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por paciente ou exame..."
                className="pl-9"
              />
            </div>
          </div>
          <ul className="divide-y divide-border">
            {filtrados.map((e) => {
              const ativo = e.id === selId;
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setSelId(e.id)}
                    className={cn(
                      "block w-full px-4 py-3 text-left transition-colors",
                      ativo ? "bg-primary-50" : "hover:bg-muted/40",
                    )}
                  >
                    <p className="text-sm font-semibold text-text-strong">{e.paciente}</p>
                    <p className="text-xs text-text-soft">
                      {e.especie} · {e.raca}
                    </p>
                    <p className="mt-1 text-xs font-medium text-text-strong">{e.exame}</p>
                    <p className="text-[11px] text-text-soft">Coleta: {e.coleta}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {e.status}
                      </span>
                      <span className="text-[11px] text-text-soft">{e.hora}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-border p-3 text-center">
            <button type="button" className="text-xs font-semibold text-primary hover:underline">
              Ver todos os exames em análise
            </button>
          </div>
        </aside>

        {/* Coluna 2 — Resultados */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-xl">🐕</span>
              <div>
                <p className="font-display text-lg font-semibold text-text-strong">{sel.paciente}</p>
                <p className="text-xs text-text-soft">
                  {sel.especie} · {sel.raca} · 3 anos · 32,5 kg · Tutor: Maria Silva
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">Ver prontuário</Button>
          </div>

          <div className="mt-4 flex gap-1 border-b border-border">
            {([
              { id: "resultados", label: "Resultados" },
              { id: "info", label: "Informações do Exame" },
            ] as const).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setAba(t.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  aba === t.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-text-strong",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {aba === "resultados" ? (
            <div className="mt-4">
              <h4 className="font-display text-base font-semibold text-text-strong">{sel.exame}</h4>
              <div className="mt-3 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-text-soft">
                      <th className="px-4 py-2.5">Parâmetro</th>
                      <th className="px-4 py-2.5">Resultado</th>
                      <th className="px-4 py-2.5">Valores de Referência</th>
                      <th className="px-4 py-2.5">Interpretação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {parametros.map((row) => (
                      <tr key={row.p} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium text-text-strong">{row.p}</td>
                        <td className="px-4 py-2.5 text-text-strong">{row.r}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{row.ref}</td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-semibold text-success-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Normal
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">Salvar rascunho</Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <Info l="Solicitante" v="Dra. Amanda Souza" />
              <Info l="Data da coleta" v={sel.coleta} />
              <Info l="Amostra" v="Sangue total (EDTA)" />
              <Info l="Prioridade" v="Rotina" />
              <Info l="Justificativa" v="Check-up anual e investigação de letargia." className="sm:col-span-2" />
            </div>
          )}
        </section>

        {/* Coluna 3 — Editor de Laudo */}
        <aside className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h3 className="font-display text-base font-semibold text-text-strong">Laudo</h3>
          <div className="mt-3 flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/30 px-2 py-1.5">
            {[Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, LinkIcon, ImageIcon].map((I, i) => (
              <button
                key={i}
                type="button"
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-surface hover:text-text-strong"
              >
                <I className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
          <Textarea
            value={laudo}
            onChange={(e) => setLaudo(e.target.value)}
            rows={10}
            className="mt-2 resize-none"
          />
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">Responsável Técnico</p>
            <Select defaultValue="ml">
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">Dra. Mariana Lima — CRMV 12345</SelectItem>
                <SelectItem value="rs">Dr. Ricardo Silva — CRMV 22871</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-5 grid gap-2">
            <Button variant="outline">Visualizar Prévia</Button>
            <Button>Finalizar e Liberar Laudo</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ l, v, className }: { l: string; v: string; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-background p-3", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">{l}</p>
      <p className="mt-1 text-sm text-text-strong">{v}</p>
    </div>
  );
}
