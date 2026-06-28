import { createFileRoute } from "@tanstack/react-router";
import { ScaffoldPage } from "@/components/ScaffoldPage";

export const Route = createFileRoute("/_equipe/painel/exames")({
  head: () => ({ meta: [{ title: "Exames. Vitalis" }] }),
  component: () => (
    <ScaffoldPage
      tag="Equipe"
      titulo="Exames"
      desc="Solicitação, coleta e resultados de exames laboratoriais e de imagem."
      proxima="Build 3: integração com laboratório e imagem."
    />
  ),
});
