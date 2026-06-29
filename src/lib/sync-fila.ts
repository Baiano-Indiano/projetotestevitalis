// Simulação de sincronização offline para a Unidade Móvel.
// Registros são gravados primeiro em uma fila local (localStorage) e
// sincronizados silenciosamente assim que a rede volta.
import { useEffect, useState, useCallback } from "react";

export type TipoRegistroCampo = "atendimento" | "vacina" | "exame";

export interface RegistroCampo {
  id: string;
  tipo: TipoRegistroCampo;
  paciente: string;
  detalhe: string;
  criadoEm: string;
  sincronizado: boolean;
}

const KEY = "vitalis:um:fila";

function ler(): RegistroCampo[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as RegistroCampo[];
  } catch {
    return [];
  }
}

function salvar(arr: RegistroCampo[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(arr));
  } catch {
    /* ignore */
  }
}

export function useSyncFila() {
  const [fila, setFila] = useState<RegistroCampo[]>(() => ler());
  const [online, setOnline] = useState<boolean>(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const adicionar = useCallback(
    (parcial: Omit<RegistroCampo, "id" | "criadoEm" | "sincronizado">) => {
      const r: RegistroCampo = {
        ...parcial,
        id: `r-${Date.now().toString(36)}`,
        criadoEm: new Date().toISOString(),
        sincronizado: false,
      };
      const nova = [r, ...ler()];
      salvar(nova);
      setFila(nova);
      return r;
    },
    [],
  );

  // Sincronização silenciosa: quando a rede voltar, marca pendentes como
  // sincronizados após pequeno atraso simulado.
  useEffect(() => {
    if (!online) return;
    const pendentes = fila.filter((r) => !r.sincronizado);
    if (pendentes.length === 0) return;
    const t = setTimeout(() => {
      const atualizada = ler().map((r) => ({ ...r, sincronizado: true }));
      salvar(atualizada);
      setFila(atualizada);
    }, 900);
    return () => clearTimeout(t);
  }, [online, fila]);

  const pendentes = fila.filter((r) => !r.sincronizado).length;

  return { fila, online, pendentes, adicionar };
}
