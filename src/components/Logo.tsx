import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Activity className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      {!mark && (
        <span className="font-display text-lg font-semibold tracking-tight text-text-strong">
          Vitalis
        </span>
      )}
    </span>
  );
}
