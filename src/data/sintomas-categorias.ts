import type { EspecialidadeId } from "@/config/municipio";
import {
  Wind,
  Soup,
  Footprints,
  Eye,
  Sparkles,
  Droplet,
  type LucideIcon,
} from "lucide-react";

export interface ItemSintoma {
  id: string;
  label: string;
  pesos: Partial<Record<EspecialidadeId, number>>;
  redFlag?: boolean;
}

export interface CategoriaSintoma {
  id: string;
  nome: string;
  icone: LucideIcon;
  cor: string; // classe tailwind para a borda/topo
  textoCor: string;
  itens: ItemSintoma[];
}

// Parte 1 — RESPIRAÇÃO, ESTÔMAGO E INTESTINO, MOVIMENTO
export const categoriasParte1: CategoriaSintoma[] = [
  {
    id: "respiracao",
    nome: "Respiração",
    icone: Wind,
    cor: "border-t-success",
    textoCor: "text-success-700",
    itens: [
      { id: "resp-tosse", label: "Tossindo", pesos: { cardiologia: 3 } },
      { id: "resp-espirro", label: "Espirrando", pesos: { cardiologia: 1 } },
      { id: "resp-secrecao", label: "Secreção no nariz", pesos: { cardiologia: 2 } },
      { id: "resp-rapido", label: "Respirando rápido", pesos: { cardiologia: 4 }, redFlag: true },
      { id: "resp-estranha", label: "Respiração estranha (chiado, ronco)", pesos: { cardiologia: 4 }, redFlag: true },
    ],
  },
  {
    id: "estomago",
    nome: "Estômago e Intestino",
    icone: Soup,
    cor: "border-t-success",
    textoCor: "text-success-700",
    itens: [
      { id: "gi-vomito", label: "Vomitando", pesos: { nefrologia: 2, oncologia: 1 } },
      { id: "gi-diarreia", label: "Diarreia", pesos: { nefrologia: 1 } },
      { id: "gi-barriga", label: "Barriga inchada", pesos: { oncologia: 2 }, redFlag: true },
      { id: "gi-engoliu", label: "Engoliu objeto", pesos: { traumatologia: 3 }, redFlag: true },
      { id: "gi-planta", label: "Comeu planta ou substância suspeita", pesos: { traumatologia: 2 }, redFlag: true },
      { id: "gi-constipacao", label: "Não consegue fazer cocô", pesos: { oncologia: 1 } },
      { id: "gi-sangue", label: "Fezes com sangue", pesos: { oncologia: 2 }, redFlag: true },
      { id: "gi-tentavomit", label: "Tenta vomitar e não consegue", pesos: { traumatologia: 3 }, redFlag: true },
    ],
  },
  {
    id: "movimento",
    nome: "Movimento",
    icone: Footprints,
    cor: "border-t-primary",
    textoCor: "text-primary",
    itens: [
      { id: "mov-mancando", label: "Mancando", pesos: { ortopedia: 4 } },
      { id: "mov-nao-anda", label: "Não consegue andar", pesos: { ortopedia: 4, traumatologia: 3 }, redFlag: true },
      { id: "mov-tremores", label: "Tremores", pesos: { traumatologia: 1 } },
      { id: "mov-circulos", label: "Andando em círculos", pesos: {}, redFlag: true },
      { id: "mov-paralisia", label: "Não consegue movimentar as patas traseiras", pesos: { ortopedia: 5, traumatologia: 4 }, redFlag: true },
    ],
  },
];

// Parte 2 — OLHOS E OUVIDOS, PELE, URINA
export const categoriasParte2: CategoriaSintoma[] = [
  {
    id: "olhos-ouvidos",
    nome: "Olhos e Ouvidos",
    icone: Eye,
    cor: "border-t-success",
    textoCor: "text-success-700",
    itens: [
      { id: "oo-olho-vermelho", label: "Olhos muito vermelhos", pesos: { dermatologia: 2 } },
      { id: "oo-olho-secrecao", label: "Olhos com secreção", pesos: { dermatologia: 2 } },
      { id: "oo-ouvido-secrecao", label: "Ouvidos com secreção", pesos: { dermatologia: 3 } },
      { id: "oo-ouvido-cheiro", label: "Ouvidos com cheiro ruim", pesos: { dermatologia: 3 } },
      { id: "oo-cocando-orelha", label: "Coçando e balançando muito a orelha", pesos: { dermatologia: 4 } },
    ],
  },
  {
    id: "pele",
    nome: "Pele",
    icone: Sparkles,
    cor: "border-t-[color:var(--accent)]",
    textoCor: "text-fuchsia-700",
    itens: [
      { id: "pele-coceira", label: "Coceira", pesos: { dermatologia: 5 } },
      { id: "pele-feridas", label: "Feridas", pesos: { dermatologia: 4 } },
      { id: "pele-queda", label: "Queda de pelo", pesos: { dermatologia: 4, endocrinologia: 1 } },
      { id: "pele-nodulo", label: "Uma ou mais bolinhas na pele", pesos: { oncologia: 5 } },
      { id: "pele-manchas", label: "Manchas", pesos: { dermatologia: 3 } },
    ],
  },
  {
    id: "urina",
    nome: "Urina",
    icone: Droplet,
    cor: "border-t-warning",
    textoCor: "text-warning-700",
    itens: [
      { id: "ur-dificuldade", label: "Dificuldade para urinar", pesos: { nefrologia: 5 }, redFlag: true },
      { id: "ur-sangue", label: "Sangue na urina", pesos: { nefrologia: 4 }, redFlag: true },
      { id: "ur-frequente", label: "Tentando urinar toda hora", pesos: { nefrologia: 4 } },
      { id: "ur-muita-sede", label: "Bebendo muita água e urinando demais", pesos: { nefrologia: 3, endocrinologia: 3 } },
      { id: "ur-nao-urina", label: "Não urina há mais de 24h", pesos: { nefrologia: 5 }, redFlag: true },
    ],
  },
];

export const todasCategorias: CategoriaSintoma[] = [...categoriasParte1, ...categoriasParte2];

export function getItemById(id: string): ItemSintoma | undefined {
  for (const c of todasCategorias) {
    const it = c.itens.find((i) => i.id === id);
    if (it) return it;
  }
  return undefined;
}

export interface MotorResultadoCategorias {
  scores: Partial<Record<EspecialidadeId, number>>;
  ranking: { especialidade: EspecialidadeId; score: number }[];
  redFlags: string[]; // ids
  sugestao: EspecialidadeId | "urgencia";
  prioridade: "alta" | "media" | "baixa";
}

export function calcularDeSelecionados(ids: string[]): MotorResultadoCategorias {
  const scores: Partial<Record<EspecialidadeId, number>> = {};
  const redFlags: string[] = [];
  for (const id of ids) {
    const it = getItemById(id);
    if (!it) continue;
    if (it.redFlag) redFlags.push(id);
    for (const [esp, p] of Object.entries(it.pesos) as [EspecialidadeId, number][]) {
      scores[esp] = (scores[esp] ?? 0) + p;
    }
  }
  const ranking = (Object.entries(scores) as [EspecialidadeId, number][])
    .map(([especialidade, score]) => ({ especialidade, score }))
    .sort((a, b) => b.score - a.score);
  const sugestao: EspecialidadeId | "urgencia" =
    redFlags.length > 0 ? "urgencia" : ranking[0]?.especialidade ?? "traumatologia";
  const prioridade: "alta" | "media" | "baixa" =
    redFlags.length > 0 ? "alta" : (ranking[0]?.score ?? 0) >= 5 ? "media" : "baixa";
  return { scores, ranking, redFlags, sugestao, prioridade };
}
