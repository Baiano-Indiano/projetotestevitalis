import type { EspecialidadeId } from "@/config/municipio";
import { sintomaPorId } from "@/data/sintomas";
import type { Prioridade, Triagem } from "@/data/types";

export interface MotorResultado {
  scores: Partial<Record<EspecialidadeId, number>>;
  ranking: { especialidade: EspecialidadeId; score: number; contribuintes: string[] }[];
  redFlags: string[];
  sugestao: EspecialidadeId | "urgencia";
  prioridade: Prioridade;
}

export function calcularMotor(sintomaIds: string[]): MotorResultado {
  const scores: Partial<Record<EspecialidadeId, number>> = {};
  const contrib: Record<string, string[]> = {};
  const redFlags: string[] = [];

  for (const id of sintomaIds) {
    const s = sintomaPorId(id);
    if (!s) continue;
    if (s.redFlag) redFlags.push(id);
    for (const [esp, peso] of Object.entries(s.pesos) as [EspecialidadeId, number][]) {
      scores[esp] = (scores[esp] ?? 0) + peso;
      (contrib[esp] ??= []).push(id);
    }
  }

  const ranking = (Object.entries(scores) as [EspecialidadeId, number][])
    .map(([especialidade, score]) => ({
      especialidade,
      score,
      contribuintes: contrib[especialidade] ?? [],
    }))
    .sort((a, b) => b.score - a.score);

  const sugestao: EspecialidadeId | "urgencia" =
    redFlags.length > 0 ? "urgencia" : ranking[0]?.especialidade ?? "traumatologia";

  const prioridade: Prioridade =
    redFlags.length > 0 ? "alta" : (ranking[0]?.score ?? 0) >= 5 ? "media" : "baixa";

  return { scores, ranking, redFlags, sugestao, prioridade };
}

export function gerarProtocolo(seq: number): string {
  const ano = new Date().getFullYear();
  return `VT-${ano}-${(800 + seq).toString().padStart(6, "0")}`;
}

export function minutosDesde(iso: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

export function tempoEsperaTexto(iso: string): string {
  const m = minutosDesde(iso);
  if (m < 1) return "agora";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h}h` : `${h}h ${r}min`;
}

export function tipoDeTriagemResumo(t: Triagem): string {
  return t.canal === "online" ? "Triagem online" : "Unidade móvel";
}
