import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { municipio } from "@/config/municipio";
import { MapPin, Phone, ArrowRight, Building2 } from "lucide-react";

export const Route = createFileRoute("/_tutor/unidades")({
  head: () => ({
    meta: [
      { title: "Unidades. Vitalis Belém" },
      { name: "description", content: "Endereços, horários e contatos das unidades do Hospital Veterinário Público Municipal de Belém — atendimento gratuito para tutores e animais da rede pública." },
      { property: "og:title", content: "Unidades — Vitalis Belém" },
      { property: "og:description", content: "Endereços, horários e contatos das unidades veterinárias municipais de Belém." },
      { property: "og:url", content: "https://projetotestevitalis.lovable.app/unidades" },
    ],
    links: [{ rel: "canonical", href: "https://projetotestevitalis.lovable.app/unidades" }],
  }),
  component: Unidades,
});

function Unidades() {
  return (
    <div className="container-app py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Rede {municipio.nomeRede}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-text-strong">
          Unidades de atendimento
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {municipio.unidades.length} unidades em {municipio.cidade}, {municipio.uf}.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {municipio.unidades.map((u) => (
            <Card key={u.id} className="border-border bg-surface p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary">
                  <Building2 className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-soft">
                    {u.tipo === "hospital" ? "Hospital" : "Clínica"}
                  </p>
                  <h2 className="mt-0.5 font-display text-base font-semibold text-text-strong">{u.nome}</h2>
                </div>
              </div>
              <p className="mt-3 inline-flex items-start gap-1.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {u.endereco}
              </p>
              {u.telefone && (
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" /> {u.telefone}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {u.servicos.map((s) => (
                  <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-text-strong">
                    {s}
                  </span>
                ))}
              </div>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(u.endereco)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir mapa <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
