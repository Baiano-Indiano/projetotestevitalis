import { Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { BlocoEspecialidadeTriagem, Pergunta } from "@/data/triagem-especialidades";

interface Props {
  bloco: BlocoEspecialidadeTriagem;
  respostas: Record<string, unknown>;
  setResposta: (id: string, valor: unknown) => void;
}

export function BlocoEspecialidade({ bloco, respostas, setResposta }: Props) {
  const Icone = bloco.icone;
  return (
    <div className="mt-4 rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span
          className={cn(
            "grid h-12 w-12 shrink-0 place-items-center rounded-full",
            bloco.corIconeBg,
          )}
        >
          <Icone className={cn("h-6 w-6", bloco.corIcone)} />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold text-text-strong">
            {bloco.titulo}
          </h2>
          <p className="text-sm text-muted-foreground">{bloco.subtitulo}</p>
        </div>
      </div>

      <div className="space-y-6">
        {bloco.perguntas.map((p, idx) => (
          <PerguntaRender
            key={p.id}
            indice={idx + 1}
            pergunta={p}
            valor={respostas[p.id]}
            onChange={(v) => setResposta(p.id, v)}
          />
        ))}
      </div>
    </div>
  );
}

function PerguntaRender({
  indice,
  pergunta,
  valor,
  onChange,
}: {
  indice: number;
  pergunta: Pergunta;
  valor: unknown;
  onChange: (v: unknown) => void;
}) {
  return (
    <div>
      <Label className="text-sm font-semibold text-text-strong">
        {indice}. {pergunta.label}
      </Label>
      <div className="mt-2.5">
        {pergunta.tipo === "simnao" && (
          <SimNao value={valor as string | undefined} onChange={(v) => onChange(v)} name={pergunta.id} />
        )}
        {pergunta.tipo === "checkbox" && (
          <CheckList opcoes={pergunta.opcoes} valores={(valor as string[]) ?? []} onChange={onChange} />
        )}
        {pergunta.tipo === "select" && (
          <Select value={(valor as string) ?? ""} onValueChange={(v) => onChange(v)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={pergunta.opcoes[0]} />
            </SelectTrigger>
            <SelectContent>
              {pergunta.opcoes.map((o, i) => (
                <SelectItem key={o} value={o} disabled={i === 0}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {pergunta.tipo === "radio-vertical" && (
          <RadioVertical opcoes={pergunta.opcoes} valor={valor as string | undefined} onChange={onChange} name={pergunta.id} />
        )}
        {pergunta.tipo === "slider" && (
          <SliderIntensidade
            valor={(valor as number) ?? 3}
            min={pergunta.min ?? 1}
            max={pergunta.max ?? 5}
            minLabel={pergunta.minLabel ?? "Leve"}
            maxLabel={pergunta.maxLabel ?? "Grave"}
            onChange={onChange}
          />
        )}
        {pergunta.tipo === "textarea" && (
          <Textarea
            rows={4}
            className="bg-muted/30"
            placeholder={pergunta.placeholder}
            value={(valor as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}

function SimNao({
  value,
  onChange,
  name,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup">
      {(["Sim", "Não"] as const).map((opt) => {
        const ativo = value === opt;
        const isSim = opt === "Sim";
        const Icone = isSim ? Check : X;
        const activeClasses = isSim
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-primary bg-primary-50 text-primary";
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all",
              ativo
                ? activeClasses
                : "border-border bg-background text-text-strong hover:border-primary/40",
            )}
            aria-pressed={ativo}
            role="radio"
            aria-checked={ativo}
            name={name}
          >
            <span
              className={cn(
                "grid h-5 w-5 place-items-center rounded-full border-2 transition-colors",
                ativo
                  ? isSim
                    ? "border-primary-foreground bg-primary-foreground text-primary"
                    : "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/50",
              )}
            >
              {ativo && <Icone className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function CheckList({
  opcoes,
  valores,
  onChange,
}: {
  opcoes: string[];
  valores: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (o: string) =>
    onChange(valores.includes(o) ? valores.filter((x) => x !== o) : [...valores, o]);
  return (
    <div className="space-y-2">
      {opcoes.map((o) => {
        const ativo = valores.includes(o);
        return (
          <label
            key={o}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-sm transition-colors",
              ativo
                ? "border-primary bg-primary-50 text-primary"
                : "border-border bg-background text-text-strong hover:border-primary/40",
            )}
          >
            <Checkbox checked={ativo} onCheckedChange={() => toggle(o)} />
            <span>{o}</span>
          </label>
        );
      })}
    </div>
  );
}

function RadioVertical({
  opcoes,
  valor,
  onChange,
  name,
}: {
  opcoes: string[];
  valor: string | undefined;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <div className="space-y-2">
      {opcoes.map((o) => {
        const ativo = valor === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm transition-colors",
              ativo
                ? "border-primary bg-primary-50 text-primary"
                : "border-border bg-background text-text-strong hover:border-primary/40",
            )}
            name={name}
          >
            <span
              className={cn(
                "grid h-4 w-4 shrink-0 place-items-center rounded-full border-2",
                ativo ? "border-primary" : "border-muted-foreground/50",
              )}
            >
              {ativo && <span className="h-2 w-2 rounded-full bg-primary" />}
            </span>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function SliderIntensidade({
  valor,
  min,
  max,
  minLabel,
  maxLabel,
  onChange,
}: {
  valor: number;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={valor}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        />
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {valor}
        </span>
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
