import { createFileRoute } from "@tanstack/react-router";
import { ScaffoldPage } from "@/components/ScaffoldPage";

export const Route = createFileRoute("/_tutor/identificacao")({
  head: () => ({ meta: [{ title: "Identificação. Vitalis Belém" }] }),
  component: () => (
    <ScaffoldPage
      tag="Tutor"
      titulo="Identifique-se para acompanhar"
      desc="Vamos enviar um código por SMS ou e-mail para vincular sua triagem ao seu cadastro."
      proxima="Build 2: identificação por OTP."
    />
  ),
});
