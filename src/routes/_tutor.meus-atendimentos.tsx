import { createFileRoute } from "@tanstack/react-router";
import { ScaffoldPage } from "@/components/ScaffoldPage";

export const Route = createFileRoute("/_tutor/meus-atendimentos")({
  head: () => ({ meta: [{ title: "Meus atendimentos. Vitalis Belém" }] }),
  component: () => (
    <ScaffoldPage
      tag="Tutor"
      titulo="Meus atendimentos"
      desc="Histórico das triagens, agendamentos e orientações da rede Vitalis."
      proxima="Build 2 e 3: histórico vinculado ao cadastro."
    />
  ),
});
