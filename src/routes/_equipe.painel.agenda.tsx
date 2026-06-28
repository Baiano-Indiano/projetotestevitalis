import { createFileRoute } from "@tanstack/react-router";
import { ScaffoldPage } from "@/components/ScaffoldPage";

export const Route = createFileRoute("/_equipe/painel/agenda")({
  head: () => ({ meta: [{ title: "Agenda da equipe. Vitalis" }] }),
  component: () => (
    <ScaffoldPage
      tag="Equipe"
      titulo="Agenda"
      desc="Visão de horários por unidade, especialidade e profissional."
      proxima="Build 2: agenda completa com confirmações e remarcações."
    />
  ),
});
