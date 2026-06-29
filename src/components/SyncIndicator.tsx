import { Wifi, WifiOff, CloudUpload, CheckCircle2 } from "lucide-react";
import { useSyncFila } from "@/lib/sync-fila";
import { cn } from "@/lib/utils";

/** Pequeno indicador discreto de sincronização para a Unidade Móvel. */
export function SyncIndicator() {
  const { online, pendentes } = useSyncFila();
  const sincronizando = online && pendentes > 0;
  const estavel = online && pendentes === 0;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
        !online && "border-warning/40 bg-warning-50 text-warning-700",
        sincronizando && "border-primary/40 bg-primary-50 text-primary-800",
        estavel && "border-success/40 bg-success-50 text-success-700",
      )}
      title={
        !online
          ? "Sem rede. Registros ficam na fila local."
          : sincronizando
            ? "Sincronizando fila local com o servidor."
            : "Tudo sincronizado."
      }
    >
      {!online && (<><WifiOff className="h-3.5 w-3.5" /> Offline · {pendentes} na fila</>)}
      {sincronizando && (<><CloudUpload className="h-3.5 w-3.5 animate-pulse" /> Sincronizando ({pendentes})</>)}
      {estavel && (<><Wifi className="h-3.5 w-3.5" /> Online <CheckCircle2 className="h-3.5 w-3.5" /></>)}
    </div>
  );
}
