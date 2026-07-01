import { useLocation } from "@tanstack/react-router";
import { useVitalisStore, type Papel } from "@/data/store";

/**
 * Resolve o papel de forma SÍNCRONA a partir da rota atual, sem depender
 * do valor persistido no store. Isso evita o "flash" do valor antigo
 * durante transições de rota (antes do useEffect de sincronização rodar).
 *
 * Regra:
 *  - Fora de /painel  → sempre "tutor".
 *  - Dentro de /painel → usa o papel do store, mas se for "tutor" (default),
 *    assume "recepcao" como fallback profissional.
 */
export function useResolvedPapel(): Papel {
  const { pathname } = useLocation();
  const { papel } = useVitalisStore();
  const isPainel = pathname.startsWith("/painel");

  if (!isPainel) return "tutor";
  if (papel === "tutor") return "recepcao";
  return papel;
}
