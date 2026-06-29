import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Plus,
  Clock,
  FlaskConical,
  CheckCircle2,
  FileText,
  Move,
  RotateCw,
  Sun,
  ZoomIn,
  ZoomOut,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/imagem")({
  head: () => ({ meta: [{ title: "Exames de Imagem. Vitalis Belém" }] }),
  component: ImagemRoute,
});

interface ExameImg {
  id: string;
  paciente: string;
  exame: string;
  data: string;
  status: "Em análise" | "Aguardando" | "Concluído";
}

const exames: ExameImg[] = [
  { id: "IMG-9821", paciente: "Thor", exame: "Raio X Tórax", data: "24/10/2023 10:30", status: "Em análise" },
  { id: "IMG-9822", paciente: "Mia", exame: "Ultrassom Abdominal", data: "24/10/2023 11:00", status: "Aguardando" },
  { id: "IMG-9823", paciente: "Bento", exame: "Raio X Coluna", data: "24/10/2023 09:15", status: "Aguardando" },
  { id: "IMG-9824", paciente: "Lola", exame: "Ultrassom Cardíaco", data: "24/10/2023 08:00", status: "Em análise" },
];

const stats = [
  { label: "Aguardando Laudo", valor: 9, Icon: Clock, tone: "bg-primary-50 text-primary-700" },
  { label: "Em Análise", valor: 6, Icon: FlaskConical, tone: "bg-warning-50 text-warning-700" },
  { label: "Laudos Finalizados", valor: 25, Icon: CheckCircle2, tone: "bg-success-50 text-success-700" },
  { label: "Laudos Hoje", valor: 8, Icon: FileText, tone: "bg-primary-50 text-primary-700" },
];

// Imagem de demonstração: radiografia torácica (CC0 via Wikimedia)
const RADIO_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Dog_chest_x-ray.jpg/800px-Dog_chest_x-ray.jpg";

function ImagemRoute() {
  const [selId, setSelId] = useState(exames[0].id);
  const sel = exames.find((e) => e.id === selId) ?? exames[0];
  const [laudo, setLaudo] = useState(
    "ACHADOS RADIOLÓGICOS:\n• Estruturas ósseas íntegras, sem evidência de fraturas ou alterações líticas.\n• Campos pulmonares com transparência normal, sem opacidades focais.\n• Silhueta cardíaca dentro dos parâmetros normais (VHS ~ 9,8 vértebras).\n• Traqueia de calibre preservado.\n• Diafragma íntegro, sem deslocamento.\n\nIMPRESSÃO:\nExame radiográfico torácico sem alterações significativas no momento. Sugere-se correlação clínica.",
  );

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Exames de Imagem
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Emissão de laudos de exames de imagem</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="w-56 pl-9" placeholder="Buscar..." />
          </div>
          <Button size="sm"><Plus className="mr-1 h-3.5 w-3.5" /> Novo Laudo</Button>
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
        {/* Coluna 1 — Lista */}
        <aside className="rounded-2xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border p-4">
            <h3 className="font-display text-sm font-semibold text-text-strong">Exames Aguardando Laudo</h3>
          </div>
          <ul className="divide-y divide-border">
            {exames.map((e) => {
              const ativo = e.id === selId;
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setSelId(e.id)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                      ativo ? "bg-primary-50" : "hover:bg-muted/40",
                    )}
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-black">
                      <img src={RADIO_URL} alt="thumb" className="h-full w-full object-cover opacity-90" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-strong">{e.paciente}</p>
                      <p className="truncate text-xs text-text-soft">{e.exame}</p>
                      <p className="text-[11px] text-text-soft">{e.data}</p>
                      <span className={cn(
                        "mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        e.status === "Em análise"
                          ? "bg-warning-50 text-warning-700"
                          : "bg-primary-50 text-primary-800",
                      )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", e.status === "Em análise" ? "bg-warning" : "bg-primary")} />
                        {e.status}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Coluna 2 — Visualizador */}
        <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <p className="font-display text-base font-semibold text-text-strong">
              {sel.exame} <span className="ml-1 text-xs font-normal text-text-soft">{sel.paciente} — {sel.data}</span>
            </p>
            <span className="rounded-full bg-primary-50 px-2.5 py-0.5 font-mono text-[10px] text-primary-800">#{sel.id}</span>
          </div>
          <div className="relative mt-3 overflow-hidden rounded-xl bg-black">
            <img src={RADIO_URL} alt={sel.exame} className="mx-auto block max-h-[460px] w-auto object-contain" />
            <div className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur">
              {[Move, RotateCw, Sun, ZoomIn, ZoomOut].map((I, i) => (
                <button key={i} type="button" className="grid h-7 w-7 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white">
                  <I className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                type="button"
                className={cn(
                  "h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 bg-black",
                  i === 0 ? "border-primary" : "border-transparent hover:border-border",
                )}
              >
                <img src={RADIO_URL} alt={`plano ${i + 1}`} className="h-full w-full object-cover opacity-90" />
              </button>
            ))}
          </div>
        </section>

        {/* Coluna 3 — Editor */}
        <aside className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h3 className="font-display text-base font-semibold text-text-strong">Laudo do Exame</h3>
          <div className="mt-3 flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/30 px-2 py-1.5">
            {[Bold, Italic, Underline, List, ListOrdered].map((I, i) => (
              <button key={i} type="button" className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-surface hover:text-text-strong">
                <I className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
          <Textarea value={laudo} onChange={(e) => setLaudo(e.target.value)} rows={12} className="mt-2 resize-none font-mono text-xs" />
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">Responsável Técnico</p>
            <Select defaultValue="rc">
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rc">Dr. Rafael Costa — CRMV 67890</SelectItem>
                <SelectItem value="ml">Dra. Mariana Lima — CRMV 12345</SelectItem>
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
