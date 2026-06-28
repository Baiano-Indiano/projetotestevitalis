import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { municipio } from "@/config/municipio";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  ShieldCheck,
  Stethoscope,
  Hospital,
  HeartPulse,
  Truck,
} from "lucide-react";

export const Route = createFileRoute("/_tutor/")({
  head: () => ({
    meta: [
      { title: "Vitalis Belém. Triagem online gratuita e atendimento veterinário" },
      {
        name: "description",
        content:
          "Cuide da saúde do seu animal pela rede pública municipal. Triagem online em minutos, orientação por especialidade e atendimento na rede Vitalis.",
      },
      { property: "og:title", content: "Vitalis Belém. Saúde veterinária pública" },
      {
        property: "og:description",
        content: "Triagem online gratuita e atendimento na rede veterinária de Belém.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-50 via-background to-background">
        <div className="container-app grid gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-surface px-3 py-1 text-xs font-medium text-primary-800">
              <ShieldCheck className="h-3.5 w-3.5" /> Serviço oficial da {municipio.prefeitura}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-text-strong md:text-5xl">
              Cuide da saúde do seu animal pela rede pública.
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              Triagem online gratuita, orientação clínica por especialidade e atendimento
              em toda a rede veterinária municipal de {municipio.cidade}.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/triagem">
                  Iniciar triagem <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/agendar">Agendar atendimento</Link>
              </Button>
              <Link
                to="/emergencia"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive-700 underline-offset-4 hover:underline"
              >
                <AlertTriangle className="h-4 w-4" /> Emergência, veja onde ir
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-text-soft">Triagens/dia</dt>
                <dd className="mt-1 font-display text-xl font-semibold text-text-strong">
                  {municipio.capacidade.triagensPorDia}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-text-soft">Unidades</dt>
                <dd className="mt-1 font-display text-xl font-semibold text-text-strong">
                  {municipio.unidades.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-text-soft">Especialidades</dt>
                <dd className="mt-1 font-display text-xl font-semibold text-text-strong">
                  {municipio.especialidades.filter((e) => e.ativa).length}
                </dd>
              </div>
            </dl>
          </div>

          <Card className="relative border-border bg-surface p-6 shadow-sm">
            <div className="flex items-start gap-3 border-b border-border pb-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-50 text-primary-800">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">
                  Triagem inteligente
                </p>
                <p className="font-display text-base font-semibold text-text-strong">
                  Orientada por veterinário
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                "6 etapas curtas, em linguagem simples.",
                "Detecção automática de sinais de emergência.",
                "Ranking de especialidades com explicação.",
                "Validação final por um veterinário da rede.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-text-strong">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-lg bg-primary-50 px-3 py-2 text-xs text-primary-800">
              O Vitalis orienta. O veterinário decide. A triagem nunca diagnostica.
            </p>
          </Card>
        </div>
      </section>

      <section className="container-app py-14 md:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
            Como funciona
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-text-strong">
            Três passos. Sem fila desnecessária.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Triagem",
              d: "Responda 6 etapas guiadas sobre o seu animal. Leva poucos minutos.",
              Icon: Stethoscope,
            },
            {
              n: "02",
              t: "Orientação",
              d: "Você recebe a especialidade indicada e a prioridade do caso.",
              Icon: ShieldCheck,
            },
            {
              n: "03",
              t: "Atendimento",
              d: "Agende ou seja atendido na rede municipal, com a triagem anexada.",
              Icon: CalendarCheck,
            },
          ].map((s) => (
            <Card key={s.n} className="border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-text-soft">{s.n}</span>
                <s.Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-text-strong">
                {s.t}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface py-14 md:py-20">
        <div className="container-app">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                Rede {municipio.nomeRede}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-text-strong">
                Nossas unidades em {municipio.cidade}
              </h2>
            </div>
            <Link
              to="/emergencia"
              className="text-sm font-medium text-primary-700 hover:underline"
            >
              Ver mapa e horários
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {municipio.unidades.map((u) => (
              <Card key={u.id} className="border-border bg-background p-5">
                <div className="flex items-center gap-2">
                  {u.tipo === "hospital" ? (
                    <Hospital className="h-4 w-4 text-primary" />
                  ) : u.tipo === "movel" ? (
                    <Truck className="h-4 w-4 text-primary" />
                  ) : (
                    <Stethoscope className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-xs font-medium uppercase tracking-wide text-text-soft">
                    {u.tipo === "movel" ? "Unidade móvel" : u.tipo === "hospital" ? "Hospital" : "Clínica"}
                  </span>
                  {u.atendimento24h && (
                    <span className="ml-auto rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-medium text-success-700">
                      24h
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-base font-semibold text-text-strong">
                  {u.nome}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{u.endereco}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {u.servicos.slice(0, 4).map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container-app py-14 md:py-16">
        <Card className="flex flex-col items-start justify-between gap-4 border-border bg-primary p-6 text-primary-foreground md:flex-row md:items-center md:p-8">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Pronto para começar?
            </h2>
            <p className="mt-1 max-w-xl text-sm text-primary-foreground/85">
              A triagem é gratuita, leva poucos minutos e fica registrada na sua conta.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link to="/triagem">Iniciar triagem agora</Link>
          </Button>
        </Card>
      </section>
    </>
  );
}
