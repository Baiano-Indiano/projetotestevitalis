import { createFileRoute } from "@tanstack/react-router";
import { ScaffoldPage } from "@/components/ScaffoldPage";

export const Route = createFileRoute("/_tutor/identificacao")({
  head: () => ({
    meta: [
      { title: "Identificação. Vitalis Belém" },
      { name: "description", content: "Vincule sua triagem ao cadastro municipal por SMS ou e-mail na rede veterinária pública de Belém." },
      { property: "og:title", content: "Identificação — Vitalis Belém" },
      { property: "og:description", content: "Vincule sua triagem ao cadastro municipal de Belém." },
      { property: "og:url", content: "https://projetotestevitalis.lovable.app/identificacao" },
    ],
    links: [{ rel: "canonical", href: "https://projetotestevitalis.lovable.app/identificacao" }],
  }),
  component: () => (
    <ScaffoldPage
      tag="Tutor"
      titulo="Identifique-se para acompanhar"
      desc="Vamos enviar um código por SMS ou e-mail para vincular sua triagem ao seu cadastro."
      proxima="Build 2: identificação por OTP."
    />
  ),
});
