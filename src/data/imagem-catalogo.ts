export interface ImagemItem {
  id: string;
  label: string;
  desc?: string;
}

export interface ImagemSubgrupo {
  nome: string;
  itens: ImagemItem[];
}

export interface ImagemCategoria {
  id: string;
  nome: string;
  subgrupos?: ImagemSubgrupo[];
  itens?: ImagemItem[];
}

const mk = (prefix: string, labels: string[]): ImagemItem[] =>
  labels.map((label) => ({
    id: `img-${prefix}-${label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`,
    label,
  }));

export const categoriasImagem: ImagemCategoria[] = [
  {
    id: "radiografia",
    nome: "Radiografia",
    subgrupos: [
      {
        nome: "Crânio",
        itens: mk("rx-cranio", [
          "Crânio completo",
          "Mandíbula",
          "Maxila",
          "Seios nasais",
          "ATM",
        ]),
      },
      {
        nome: "Coluna",
        itens: mk("rx-coluna", ["Cervical", "Torácica", "Lombar", "Sacral", "Caudal"]),
      },
      { nome: "Tórax", itens: mk("rx-torax", ["Tórax", "Costelas", "Esterno"]) },
      { nome: "Abdômen", itens: mk("rx-abd", ["Abdômen simples", "Abdômen com contraste"]) },
      { nome: "Pelve", itens: mk("rx-pelve", ["Pelve", "Quadril"]) },
      {
        nome: "Membros Torácicos",
        itens: mk("rx-mt", [
          "Escápula",
          "Ombro",
          "Úmero",
          "Cotovelo",
          "Rádio/Ulna",
          "Carpo",
          "Metacarpo",
          "Falanges torácicas",
        ]),
      },
      {
        nome: "Membros Pélvicos",
        itens: mk("rx-mp", [
          "Fêmur",
          "Joelho",
          "Tíbia/Fíbula",
          "Tarso",
          "Metatarso",
          "Falanges pélvicas",
        ]),
      },
    ],
  },
  {
    id: "ultrassonografia",
    nome: "Ultrassonografia",
    subgrupos: [
      {
        nome: "Modalidades",
        itens: mk("us-mod", [
          "Abdome total",
          "Abdome focal",
          "Gestacional",
          "Musculoesquelética",
          "Oftálmica",
          "Cervical",
          "Torácica",
        ]),
      },
      {
        nome: "Abdome focal — órgãos",
        itens: mk("us-focal", [
          "Fígado",
          "Vesícula biliar",
          "Baço",
          "Estômago",
          "Intestino",
          "Pâncreas",
          "Rins",
          "Adrenais",
          "Bexiga",
          "Ureteres",
          "Linfonodos",
          "Próstata",
          "Útero",
          "Ovários",
        ]),
      },
      {
        nome: "Gestacional",
        itens: mk("us-gest", [
          "Diagnóstico de gestação",
          "Contagem fetal",
          "Avaliação fetal",
        ]),
      },
      {
        nome: "Musculoesquelética",
        itens: mk("us-me", ["Tendões", "Ligamentos", "Massa muscular"]),
      },
    ],
  },
  {
    id: "ecocardiograma",
    nome: "Ecocardiograma",
    itens: mk("eco", [
      "Ecocardiograma completo",
      "Doppler colorido",
      "Doppler pulsado",
      "Doppler contínuo",
      "Modo M",
      "Avaliação pré-anestésica",
      "Avaliação cardiológica completa",
    ]),
  },
  {
    id: "eletrocardiograma",
    nome: "Eletrocardiograma",
    itens: mk("ecg", [
      "ECG convencional",
      "ECG contínuo (Holter)",
      "ECG pré-operatório",
    ]),
  },
];

export const projecoesRadiografia = [
  "Latero-lateral direita",
  "Latero-lateral esquerda",
  "Ventrodorsal",
  "Dorsoventral",
  "Craniocaudal",
  "Caudocranial",
  "Oblíquas",
  "Skyline",
  "Tangencial",
  "Personalizada",
];

export function todosItensImagem(): ImagemItem[] {
  const out: ImagemItem[] = [];
  for (const cat of categoriasImagem) {
    if (cat.itens) out.push(...cat.itens);
    if (cat.subgrupos) for (const s of cat.subgrupos) out.push(...s.itens);
  }
  return out;
}

export function itensDaCategoriaImagem(cat: ImagemCategoria): ImagemItem[] {
  if (cat.itens) return cat.itens;
  return cat.subgrupos?.flatMap((s) => s.itens) ?? [];
}

export function labelImagem(id: string): string | undefined {
  return todosItensImagem().find((i) => i.id === id)?.label;
}

export interface PerfilImagem {
  id: string;
  nome: string;
  descricao: string;
  itens: string[];
}

const idsPor = (labels: string[]): string[] => {
  const all = todosItensImagem();
  return labels
    .map((l) => all.find((i) => i.label === l)?.id)
    .filter((v): v is string => Boolean(v));
};

export const perfisImagem: PerfilImagem[] = [
  {
    id: "torax-2v",
    nome: "Tórax 2 vistas",
    descricao: "Radiografia torácica de rotina.",
    itens: idsPor(["Tórax"]),
  },
  {
    id: "abd-3v",
    nome: "Abdômen 3 vistas",
    descricao: "Abdômen simples completo.",
    itens: idsPor(["Abdômen simples"]),
  },
  {
    id: "cardio",
    nome: "Cardio completo",
    descricao: "Eco completo + ECG convencional.",
    itens: idsPor(["Ecocardiograma completo", "ECG convencional"]),
  },
  {
    id: "displasia",
    nome: "Rastreio displasia",
    descricao: "Pelve, quadril e joelho.",
    itens: idsPor(["Pelve", "Quadril", "Joelho"]),
  },
];
