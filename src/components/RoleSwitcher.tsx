import { useVitalisStore, type Papel } from "@/data/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation, useNavigate } from "@tanstack/react-router";

const labels: Record<Papel, string> = {
  tutor: "Tutor",
  recepcao: "Recepção / Triagem",
  veterinario: "Veterinário",
};

export function RoleSwitcher() {
  const { papel, setPapel } = useVitalisStore();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPapel = location.pathname.startsWith("/painel") ? papel : "tutor";

  const onChange = (v: Papel) => {
    setPapel(v);
    if (v === "tutor") navigate({ to: "/" });
    else navigate({ to: "/painel" });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-medium uppercase tracking-wide text-text-soft sm:inline">
        Protótipo
      </span>
      <Select value={selectedPapel} onValueChange={(v) => onChange(v as Papel)}>
        <SelectTrigger className="h-9 w-[200px] bg-surface">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(labels) as Papel[]).map((k) => (
            <SelectItem key={k} value={k}>
              {labels[k]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
