import { createFileRoute } from "@tanstack/react-router";
import { TutorShell } from "@/components/TutorShell";

export const Route = createFileRoute("/_tutor")({
  component: TutorShell,
});
