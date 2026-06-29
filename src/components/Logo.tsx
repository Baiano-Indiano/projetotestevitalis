import { cn } from "@/lib/utils";
import logoAsset from "@/assets/vitalis-logo.jpg.asset.json";

export function Logo({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img
        src={logoAsset.url}
        alt="Vitalis"
        className="h-9 w-9 object-contain"
      />
      {!mark && (
        <span className="font-display text-lg font-semibold tracking-tight text-text-strong">
          Vitalis
        </span>
      )}
    </span>
  );
}
