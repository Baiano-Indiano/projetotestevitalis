import { createFileRoute } from "@tanstack/react-router";
import { ScaffoldPage } from "@/components/ScaffoldPage";

export const Route = createFileRoute("/_equipe/painel/ficha/$id")({
  head: () => ({ meta: [{ title: "Ficha clínica. Vitalis" }] }),
  component: () => (
    <ScaffoldPage
      tag="Equipe"
      titulo="Ficha clínica"
      desc="Prontuário único do animal, com histórico, evolução e prescrições."
      proxima="Build 3: EHR por especialidade."
    />
  ),
});
