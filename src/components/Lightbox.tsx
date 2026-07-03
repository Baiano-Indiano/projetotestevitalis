import { useEffect, useState } from "react";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

type Foto = { nome: string; url: string };

interface LightboxProps {
  fotos: Foto[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export function Lightbox({ fotos, index, onClose, onIndexChange }: LightboxProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<{ x: number; y: number } | null>(null);

  const foto = fotos[index];

  const reset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    reset();
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && index < fotos.length - 1) onIndexChange(index + 1);
      else if (e.key === "ArrowLeft" && index > 0) onIndexChange(index - 1);
      else if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.5, 5));
      else if (e.key === "-") setScale((s) => Math.max(s - 0.5, 1));
      else if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, fotos.length, onClose, onIndexChange]);

  if (!foto) return null;

  const zoomIn = () => setScale((s) => Math.min(s + 0.5, 5));
  const zoomOut = () => {
    setScale((s) => {
      const n = Math.max(s - 0.5, 1);
      if (n === 1) setOffset({ x: 0, y: 0 });
      return n;
    });
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setScale((s) => {
      const n = Math.max(1, Math.min(5, s + delta));
      if (n === 1) setOffset({ x: 0, y: 0 });
      return n;
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${index + 1} de ${fotos.length}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3 text-white">
        <div className="min-w-0 truncate text-sm">
          <span className="font-semibold">{index + 1}/{fotos.length}</span>
          <span className="ml-2 opacity-70">{foto.nome}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= 1}
            aria-label="Diminuir zoom"
            className="rounded p-2 hover:bg-white/10 disabled:opacity-40"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <span className="w-12 text-center text-xs tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= 5}
            aria-label="Aumentar zoom"
            className="rounded p-2 hover:bg-white/10 disabled:opacity-40"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Restaurar zoom"
            className="rounded p-2 hover:bg-white/10"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="ml-2 rounded p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 overflow-hidden"
        onWheel={onWheel}
        onMouseDown={(e) => {
          if (scale > 1) setDragging({ x: e.clientX - offset.x, y: e.clientY - offset.y });
        }}
        onMouseMove={(e) => {
          if (dragging) setOffset({ x: e.clientX - dragging.x, y: e.clientY - dragging.y });
        }}
        onMouseUp={() => setDragging(null)}
        onMouseLeave={() => setDragging(null)}
      >
        {index > 0 && (
          <button
            type="button"
            onClick={() => onIndexChange(index - 1)}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {index < fotos.length - 1 && (
          <button
            type="button"
            onClick={() => onIndexChange(index + 1)}
            aria-label="Próxima foto"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
        >
          <img
            src={foto.url}
            alt={`Foto ${index + 1} de ${fotos.length} anexada à triagem`}
            draggable={false}
            className="max-h-full max-w-full select-none transition-transform"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: "center center",
            }}
          />
        </div>
      </div>
    </div>
  );
}
