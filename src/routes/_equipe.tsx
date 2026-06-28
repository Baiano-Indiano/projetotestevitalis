import { createFileRoute } from "@tanstack/react-router";
import { EquipeShell } from "@/components/EquipeShell";

export const Route = createFileRoute("/_equipe")({
  component: EquipeShell,
});
