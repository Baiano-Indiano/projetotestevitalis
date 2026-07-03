import { createFileRoute } from "@tanstack/react-router";
import { ScaffoldPage } from "@/components/ScaffoldPage";

export const Route = createFileRoute("/_tutor/meus-atendimentos")({
  head: () => ({
    meta: [
      { title: "Meus atendimentos. Vitalis Belém" },
      {
        name: "description",
        content:
          "Acompanhe suas triagens, agendamentos e orientações veterinárias na rede pública municipal de Belém.",
      },
      { property: "og:title", content: "Meus atendimentos — Vitalis Belém" },
      { property: "og:description", content: "Histórico de triagens e agendamentos vinculado ao seu cadastro municipal." },
      { property: "og:url", content: "https://projetotestevitalis.lovable.app/meus-atendimentos" },
    ],
    links: [{ rel: "canonical", href: "https://projetotestevitalis.lovable.app/meus-atendimentos" }],
  }),
  component: () => (
    <ScaffoldPage
      tag="Tutor"
      titulo="Meus atendimentos"
      desc="Aqui você acompanha o histórico de triagens, agendamentos e orientações da rede Vitalis vinculado ao seu cadastro."
      proxima="Em breve: histórico completo vinculado ao seu cadastro municipal."
    />
  ),
});
