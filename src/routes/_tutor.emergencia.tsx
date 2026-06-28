import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { municipio, unidade24h } from "@/config/municipio";
import { AlertTriangle, MapPin, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_tutor/emergencia")({
  head: () => ({
    meta: [
      { title: "Emergência veterinária. Vitalis Belém" },
      { name: "description", content: "Unidades 24h e o que fazer em caso de emergência." },
    ],
  }),
  component: Emergencia,
});

function Emergencia() {
  const u24 = unidade24h();
  return (
    <div className="container-app py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive-50 p-5 text-destructive-700">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5" aria-hidden="true" />
            <div>
              <h1 className="font-display text-xl font-semibold">Emergência veterinária</h1>
              <p className="mt-1 text-sm">
                Se há sinais graves (dificuldade respiratória, convulsão, sangramento ativo,
                ingestão de tóxico, colapso), procure imediatamente uma unidade 24h.
              </p>
            </div>
          </div>
        </div>

        <Card className="border-border bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
            Unidade 24h
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-text-strong">{u24.nome}</h2>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> {u24.endereco}
          </p>
          {u24.telefone && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" /> {u24.telefone}
            </p>
          )}
          <Button asChild variant="destructive" className="mt-4">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${u24.lat},${u24.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              Abrir mapa <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </Card>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-soft">
            Todas as unidades da rede
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {municipio.unidades.map((u) => (
              <Card key={u.id} className="border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-text-strong">{u.nome}</p>
                  {u.atendimento24h && (
                    <span className="rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-medium text-success-700">
                      24h
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{u.endereco}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
