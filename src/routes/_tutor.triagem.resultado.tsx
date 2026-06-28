import { createFileRoute, Link } from "@tanstack/react-router";
import { useVitalisStore } from "@/data/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RedFlagBanner } from "@/components/RedFlagBanner";
import { municipio, nomeEspecialidade, unidade24h } from "@/config/municipio";
import { sintomaPorId } from "@/data/sintomas";
import { ArrowRight, CalendarCheck, MapPin, Phone, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_tutor/triagem/resultado")({
  head: () => ({
    meta: [
      { title: "Resultado da triagem. Vitalis Belém" },
      { name: "description", content: "Orientação clínica gerada pela triagem Vitalis." },
    ],
  }),
  component: Resultado,
});

function Resultado() {
  const { triagens, ultimaTriagemId } = useVitalisStore();
  const t = triagens.find((x) => x.id === ultimaTriagemId);

  if (!t) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-text-strong">
          Nenhuma triagem recente
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Inicie uma nova triagem para ver o resultado aqui.
        </p>
        <Button asChild className="mt-6">
          <Link to="/triagem">Iniciar triagem</Link>
        </Button>
      </div>
    );
  }

  const urgencia = t.sugestao === "urgencia";
  const u24 = unidade24h();
  const ranking = (Object.entries(t.scores) as [string, number][])
    .sort((a, b) => b[1] - a[1]);
  const maxScore = ranking[0]?.[1] ?? 1;

  return (
    <div className="container-app py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">
              Protocolo
            </p>
            <p className="font-mono text-base font-medium text-text-strong">{t.protocolo}</p>
          </div>
          <span className="rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700">
            Triagem registrada
          </span>
        </div>

        {urgencia ? (
          <>
            <RedFlagBanner
              ids={t.redFlags}
              acao={
                <Button asChild variant="destructive">
                  <Link to="/emergencia">Buscar urgência agora</Link>
                </Button>
              }
            />
            <Card className="border-border bg-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                Unidade 24h mais próxima
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold text-text-strong">{u24.nome}</h2>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {u24.endereco}
              </p>
              {u24.telefone && (
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" /> {u24.telefone}
                </p>
              )}
              <div className="mt-4 rounded-lg bg-muted p-4 text-sm text-text-strong">
                <p className="font-medium">No caminho:</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Mantenha o animal em local arejado e contido.</li>
                  <li>Não ofereça água ou comida.</li>
                  <li>Anote o horário de início dos sintomas.</li>
                </ul>
              </div>
              <Button asChild className="mt-5" variant="destructive">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${u24.lat},${u24.lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir mapa <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </Card>
          </>
        ) : (
          <>
            <Card className="border-border bg-surface p-6">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-50 text-primary-800">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                    Orientação
                  </p>
                  <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-text-strong">
                    Procurar {nomeEspecialidade(t.sugestao as never)}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Os sintomas relatados sugerem avaliação por esta especialidade.
                    Um veterinário confirmará no atendimento.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-border bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">
                  Sintomas que levaram a esta sugestão
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {t.etapas.sintomas.map((id) => (
                    <span key={id} className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text-strong">
                      {sintomaPorId(id)?.nome ?? id}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">
                Hipóteses por especialidade
              </p>
              <ul className="mt-3 space-y-3">
                {ranking.map(([esp, score]) => (
                  <li key={esp}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-text-strong">{nomeEspecialidade(esp as never)}</span>
                      <span className="font-mono text-xs text-text-soft">score {Math.round(score)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.round((score / maxScore) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <Button asChild size="lg">
            <Link to="/agendar">
              <CalendarCheck className="mr-1.5 h-4 w-4" /> Agendar atendimento
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/identificacao">Acompanhar, identificar-se</Link>
          </Button>
        </div>

        <p className="text-center text-xs text-text-soft">
          Esta é uma orientação. O Vitalis não diagnostica. {municipio.nomeRede}.
        </p>
      </div>
    </div>
  );
}
