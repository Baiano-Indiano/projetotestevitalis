import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_equipe/painel/validacao/")({
  component: () => (
    <Card className="grid min-h-[60vh] place-items-center border-dashed border-border bg-surface p-10 text-center">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary-800">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="mt-3 font-display text-lg font-semibold text-text-strong">
          Selecione um caso na fila
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Os casos com sinais de emergência aparecem fixados no topo. Use J e K para
          navegar e Enter para confirmar a decisão.
        </p>
      </div>
    </Card>
  ),
});
