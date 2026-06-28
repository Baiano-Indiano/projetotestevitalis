import { createFileRoute } from "@tanstack/react-router";
import { ScaffoldPage } from "@/components/ScaffoldPage";

export const Route = createFileRoute("/_tutor/informacoes")({
  head: () => ({
    meta: [{ title: "Como funciona. Vitalis Belém" }],
  }),
  component: () => (
    <ScaffoldPage
      tag="Tutor"
      titulo="Como funciona o Vitalis"
      desc="Esta página detalha o fluxo de triagem, validação clínica e atendimento. Em construção no próximo Build."
      proxima="Conteúdo institucional e perguntas frequentes."
    />
  ),
});
