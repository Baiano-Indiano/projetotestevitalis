import { cn } from "@/lib/utils";
import logoAsset from "@/assets/vitalis-logo.png.asset.json";

type Size = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<Size, { img: string; text: string; gap: string }> = {
  sm: { img: "h-9 w-9", text: "text-base", gap: "gap-2" },
  md: { img: "h-11 w-11", text: "text-lg", gap: "gap-2.5" },
  lg: { img: "h-14 w-14", text: "text-2xl", gap: "gap-3" },
  xl: { img: "h-20 w-20", text: "text-3xl", gap: "gap-3.5" },
};

export function Logo({
  className,
  mark = false,
  size = "lg",
}: {
  className?: string;
  mark?: boolean;
  size?: Size;
}) {
  const s = sizeMap[size];
  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <span
        className={cn(
          "grid shrink-0 place-items-center overflow-hidden",
          s.img,
        )}
      >
        <img
          src={logoAsset.url}
          alt="Vitalis"
          className="h-full w-full object-contain"
          loading="eager"
          decoding="async"
        />
      </span>
      {!mark && (
        <span
          className={cn(
            "font-display font-bold tracking-tight text-text-strong leading-none",
            s.text,
          )}
        >
          Vitalis
        </span>
      )}
    </span>
  );
}
