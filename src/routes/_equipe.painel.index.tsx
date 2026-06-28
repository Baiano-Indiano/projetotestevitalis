import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_equipe/painel/")({
  beforeLoad: () => {
    throw redirect({ to: "/painel/recepcao" });
  },
});
