import { AlertTriangle } from "lucide-react";
import { sintomaPorId } from "@/data/sintomas";

export function RedFlagBanner({
  ids,
  acao,
}: {
  ids: string[];
  acao?: React.ReactNode;
}) {
  if (!ids.length) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/40 bg-destructive-50 p-4 text-destructive-700"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="font-display text-base font-semibold">
            Sinais de emergência detectados
          </h3>
          <p className="mt-1 text-sm text-destructive-700/90">
            Os sinais abaixo exigem avaliação imediata por um veterinário.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ids.map((id) => {
              const s = sintomaPorId(id);
              return (
                <li
                  key={id}
                  className="rounded-full border border-destructive/30 bg-white/70 px-2.5 py-1 text-xs font-medium text-destructive-700"
                >
                  {s?.nome ?? id}
                </li>
              );
            })}
          </ul>
          {acao ? <div className="mt-4 flex flex-wrap gap-2">{acao}</div> : null}
        </div>
      </div>
    </div>
  );
}
