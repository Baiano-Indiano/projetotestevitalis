import { createFileRoute } from "@tanstack/react-router";
import { ScaffoldPage } from "@/components/ScaffoldPage";

export const Route = createFileRoute("/_tutor/agendar")({
  head: () => ({ meta: [{ title: "Agendar atendimento. Vitalis Belém" }] }),
  component: () => (
    <ScaffoldPage
      tag="Tutor"
      titulo="Agendar atendimento"
      desc="Seleção de unidade, especialidade e horário com base na triagem do animal."
      proxima="Build 2: identificação por OTP e fluxo completo de agendamento."
    />
  ),
});
