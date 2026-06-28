import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

export function ScaffoldPage({
  tag,
  titulo,
  desc,
  proxima,
}: {
  tag: string;
  titulo: string;
  desc: string;
  proxima: string;
}) {
  return (
    <div className="container-app py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">{tag}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-text-strong">
          {titulo}
        </h1>
        <p className="mt-2 text-base text-muted-foreground">{desc}</p>
        <Card className="mt-6 border-dashed border-border bg-surface p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-50 text-primary-800">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-strong">Próxima etapa</p>
              <p className="mt-1 text-sm text-muted-foreground">{proxima}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/">Voltar ao início</Link>
            </Button>
            <Button asChild>
              <Link to="/triagem">Iniciar triagem</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
