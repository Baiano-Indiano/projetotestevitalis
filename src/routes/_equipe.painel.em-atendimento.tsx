import { createFileRoute } from "@tanstack/react-router";
import { Volume2, PawPrint, Cat, Clock, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/em-atendimento")({
  head: () => ({ meta: [{ title: "Painel de Chamadas - TV. Vitalis Belém" }] }),
  component: PainelTV,
});

type Risco = "vermelho" | "laranja" | "amarelo" | "verde" | "azul";

const RISCO: Record<Risco, { bg: string; ring: string; label: string; text: string }> = {
  vermelho: { bg: "bg-red-600", ring: "ring-red-400", label: "Emergência", text: "text-red-100" },
  laranja: { bg: "bg-orange-500", ring: "ring-orange-300", label: "Muito urgente", text: "text-orange-100" },
  amarelo: { bg: "bg-yellow-400", ring: "ring-yellow-200", label: "Urgente", text: "text-yellow-900" },
  verde: { bg: "bg-green-500", ring: "ring-green-300", label: "Pouco urgente", text: "text-green-100" },
  azul: { bg: "bg-blue-500", ring: "ring-blue-300", label: "Não urgente", text: "text-blue-100" },
};

const ultimaChamada = {
  nome: "REX",
  tutor: "Maria Silva",
  local: "CONSULTÓRIO 02",
  vet: "Dra. Ana Mendes",
  risco: "laranja" as Risco,
  especie: "cao" as "cao" | "gato",
};

const fila: {
  senha: string;
  nome: string;
  tutor: string;
  especie: "cao" | "gato";
  risco: Risco;
  espera: string;
}[] = [
  { senha: "A-108", nome: "Luna", tutor: "João Souza", especie: "gato", risco: "vermelho", espera: "2 min" },
  { senha: "A-109", nome: "Thor", tutor: "Ana Oliveira", especie: "cao", risco: "laranja", espera: "8 min" },
  { senha: "A-110", nome: "Bidu", tutor: "Carlos Mendes", especie: "cao", risco: "amarelo", espera: "17 min" },
  { senha: "A-111", nome: "Mel", tutor: "Patrícia Lima", especie: "gato", risco: "amarelo", espera: "22 min" },
  { senha: "A-112", nome: "Nina", tutor: "Roberto Alves", especie: "cao", risco: "verde", espera: "35 min" },
  { senha: "A-113", nome: "Simba", tutor: "Fernanda Rocha", especie: "gato", risco: "verde", espera: "41 min" },
  { senha: "A-114", nome: "Toby", tutor: "Lucas Pereira", especie: "cao", risco: "azul", espera: "58 min" },
];

function PainelTV() {
  const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const UltimaIcone = ultimaChamada.especie === "gato" ? Cat : PawPrint;
  const risc = RISCO[ultimaChamada.risco];

  return (
    <div className="-m-4 min-h-screen bg-slate-950 text-slate-50 md:-m-8">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Hospital Municipal Veterinário
          </p>
          <h1 className="font-display text-xl font-bold tracking-tight">Painel de Chamadas</h1>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold tabular-nums">{now}</p>
          <p className="text-xs uppercase tracking-widest text-slate-400">Belém - PA</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2 lg:gap-6 lg:p-6">
        {/* Última chamada */}
        <section
          className={cn(
            "relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl",
            "min-h-[70vh]",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Última chamada
            </span>
            <Volume2 className="h-8 w-8 animate-pulse text-amber-300" />
          </div>

          <div className="flex flex-col items-center text-center animate-pulse-slow">
            <div
              className={cn(
                "mb-6 grid h-28 w-28 place-items-center rounded-full ring-8",
                risc.bg,
                risc.ring,
              )}
            >
              <UltimaIcone className="h-14 w-14 text-white" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Chamando
            </p>
            <h2 className="mt-3 font-display text-7xl font-black uppercase leading-none tracking-tight text-white md:text-8xl xl:text-9xl">
              {ultimaChamada.nome}
            </h2>
            <p className="mt-4 text-lg text-slate-300 md:text-xl">
              Tutor: <span className="font-semibold text-slate-100">{ultimaChamada.tutor}</span>
            </p>

            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-amber-400 px-8 py-4 text-slate-900 shadow-xl">
              <DoorOpen className="h-8 w-8" />
              <span className="font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
                {ultimaChamada.local}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Atendimento por {ultimaChamada.vet}</span>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase",
                risc.bg,
                risc.text,
              )}
            >
              <span className="h-2 w-2 rounded-full bg-current opacity-80" />
              {risc.label}
            </span>
          </div>
        </section>

        {/* Fila de espera */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
              Fila de espera
            </h2>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-bold text-slate-200">
              {fila.length} pacientes
            </span>
          </div>

          <ul className="space-y-3">
            {fila.map((p, idx) => {
              const r = RISCO[p.risco];
              const Icone = p.especie === "gato" ? Cat : PawPrint;
              return (
                <li
                  key={p.senha}
                  className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-colors hover:bg-slate-900"
                >
                  <span
                    className={cn(
                      "grid h-14 w-14 shrink-0 place-items-center rounded-2xl ring-4 ring-slate-800",
                      r.bg,
                    )}
                    title={r.label}
                    aria-label={`Classificação de risco: ${r.label}`}
                  >
                    <Icone className="h-6 w-6 text-white drop-shadow" />
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <p className="font-mono text-sm font-bold text-slate-400">{p.senha}</p>
                      <p className="font-display text-2xl font-bold uppercase tracking-tight text-white truncate">
                        {p.nome}
                      </p>
                    </div>
                    <p className="text-sm text-slate-400 truncate">Tutor: {p.tutor}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                        r.bg,
                        r.text,
                      )}
                    >
                      {r.label}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                      <Clock className="h-3 w-3" /> {p.espera}
                    </span>
                  </div>

                  {idx === 0 && (
                    <span className="ml-2 hidden rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white md:inline">
                      Próximo
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Legenda */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-800 pt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <span>Protocolo de Manchester:</span>
            {(Object.keys(RISCO) as Risco[]).map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className={cn("h-3 w-3 rounded-full", RISCO[k].bg)} />
                {RISCO[k].label}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
