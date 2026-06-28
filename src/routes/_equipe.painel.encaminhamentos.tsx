import { createFileRoute } from "@tanstack/react-router";
import { ScaffoldPage } from "@/components/ScaffoldPage";

export const Route = createFileRoute("/_equipe/painel/encaminhamentos")({
  head: () => ({ meta: [{ title: "Encaminhamentos. Vitalis" }] }),
  component: () => (
    <ScaffoldPage
      tag="Equipe"
      titulo="Encaminhamentos"
      desc="Casos transferidos entre unidades e especialidades com rastreabilidade."
      proxima="Build 3: fluxo formal de encaminhamento e contra-referência."
    />
  ),
});
