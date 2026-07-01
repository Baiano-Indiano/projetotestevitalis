export interface ExameItem {
  id: string;
  label: string;
  desc?: string;
}

export interface ExameCategoria {
  id: string;
  nome: string;
  subgrupos?: { nome: string; itens: ExameItem[] }[];
  itens?: ExameItem[];
}

const mk = (prefix: string, list: [string, string?][]): ExameItem[] =>
  list.map(([label, desc]) => ({
    id: `${prefix}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    label,
    desc,
  }));

export const categoriasExames: ExameCategoria[] = [
  {
    id: "hematologia",
    nome: "Hematologia",
    itens: mk("hem", [
      ["Hemograma completo", "Avaliação global das séries vermelha, branca e plaquetária."],
      ["Eritrograma", "Análise da série vermelha (hemácias, Hb, Ht)."],
      ["Leucograma", "Contagem e diferencial de leucócitos."],
      ["Plaquetas", "Contagem plaquetária isolada."],
      ["Hematócrito", "Percentual de hemácias no sangue."],
      ["Proteínas Plasmáticas Totais (PPT)", "Estimativa por refratômetro."],
      ["Reticulócitos", "Avalia resposta regenerativa da medula."],
      ["Fibrinogênio", "Marcador de inflamação e coagulação."],
      ["Pesquisa de hemoparasitas", "Esfregaço para Babesia, Ehrlichia, Mycoplasma."],
      ["Tipagem sanguínea"],
      ["Crossmatch", "Prova de compatibilidade pré-transfusional."],
    ]),
  },
  {
    id: "bioquimica",
    nome: "Bioquímica",
    subgrupos: [
      {
        nome: "Função Renal",
        itens: mk("bq-renal", [
          ["Ureia"],
          ["Creatinina"],
          ["SDMA", "Marcador precoce de disfunção renal."],
          ["Fósforo"],
          ["Cistatina C"],
        ]),
      },
      {
        nome: "Função Hepática",
        itens: mk("bq-hep", [
          ["ALT (TGP)"],
          ["AST (TGO)"],
          ["Fosfatase Alcalina (FA)"],
          ["GGT"],
          ["Albumina"],
          ["Globulinas"],
          ["Proteínas Totais"],
          ["Relação Albumina/Globulina"],
          ["Bilirrubina Total"],
          ["Bilirrubina Direta"],
          ["Bilirrubina Indireta"],
          ["Ácidos Biliares"],
        ]),
      },
      {
        nome: "Função Pancreática",
        itens: mk("bq-panc", [["Amilase"], ["Lipase"], ["cPL"], ["Spec cPL"], ["fPL"], ["Spec fPL"], ["TLI"]]),
      },
      { nome: "Função Muscular", itens: mk("bq-musc", [["CK"], ["LDH"]]) },
      { nome: "Cardíacos", itens: mk("bq-card", [["Troponina I"], ["NT-proBNP"]]) },
      {
        nome: "Metabolismo",
        itens: mk("bq-met", [["Glicose"], ["Frutosamina"], ["Lactato"], ["Colesterol"], ["HDL"], ["LDL"], ["Triglicerídeos"]]),
      },
      {
        nome: "Eletrólitos",
        itens: mk("bq-ele", [["Sódio"], ["Potássio"], ["Cloro"], ["Cálcio Total"], ["Cálcio Ionizado"], ["Magnésio"], ["Fósforo"]]),
      },
    ],
  },
  {
    id: "endocrinologia",
    nome: "Endocrinologia",
    itens: mk("endo", [
      ["T4 Total"],
      ["T4 Livre"],
      ["TSH Canino"],
      ["Cortisol Basal"],
      ["Cortisol pós-ACTH"],
      ["ACTH"],
      ["Insulina"],
      ["Progesterona"],
      ["Estradiol"],
      ["Testosterona"],
      ["GH"],
    ]),
  },
  {
    id: "coagulacao",
    nome: "Coagulação",
    itens: mk("coag", [
      ["TP"],
      ["TTPA"],
      ["Fibrinogênio"],
      ["D-Dímero"],
      ["Tempo de Sangramento"],
      ["Tempo de Coagulação"],
    ]),
  },
  {
    id: "inflamacao",
    nome: "Inflamação",
    itens: mk("infl", [["Proteína C Reativa (PCR)"], ["SAA"], ["Haptoglobina"]]),
  },
  {
    id: "urinalise",
    nome: "Urinálise",
    itens: mk("uri", [
      ["Urina Tipo I"],
      ["Relação Proteína/Creatinina Urinária (UPC)"],
      ["Sedimento Urinário"],
      ["Densidade Urinária"],
      ["Urocultura"],
      ["Antibiograma"],
    ]),
  },
  {
    id: "parasitologia",
    nome: "Parasitologia",
    itens: mk("par", [
      ["Coproparasitológico"],
      ["Flutuação"],
      ["Sedimentação"],
      ["Baermann"],
      ["Pesquisa de Giardia"],
      ["Pesquisa de Cryptosporidium"],
    ]),
  },
  {
    id: "microbiologia",
    nome: "Microbiologia",
    itens: mk("mic", [["Cultura Bacteriana"], ["Antibiograma"], ["Cultura Fúngica"]]),
  },
  {
    id: "citologia",
    nome: "Citologia",
    itens: mk("cit", [
      ["Citologia Aspirativa"],
      ["Citologia Vaginal"],
      ["Citologia Otológica"],
      ["Citologia Cutânea"],
    ]),
  },
  {
    id: "histopatologia",
    nome: "Histopatologia",
    itens: mk("histo", [["Histopatológico"], ["Imuno-histoquímica"]]),
  },
  {
    id: "sorologias",
    nome: "Sorologias/Testes Rápidos",
    itens: mk("sor", [
      ["FIV/FeLV"],
      ["Cinomose"],
      ["Parvovirose"],
      ["Ehrlichiose"],
      ["Anaplasmose"],
      ["Leishmaniose"],
      ["Dirofilariose"],
      ["Leptospirose"],
      ["Brucelose"],
      ["Toxoplasmose"],
      ["Neospora"],
    ]),
  },
  {
    id: "pcr",
    nome: "PCR / Biologia Molecular",
    itens: mk("pcr", [
      ["PCR para Hemoparasitas"],
      ["PCR para FIV"],
      ["PCR para FeLV"],
      ["PCR para Cinomose"],
      ["PCR para Leishmaniose"],
      ["PCR para Micoplasma"],
      ["PCR para Coronavírus Felino (PIF)"],
      ["Outros PCR"],
    ]),
  },
  {
    id: "liquidos",
    nome: "Líquidos Cavitários",
    itens: mk("liq", [
      ["Líquido Pleural"],
      ["Líquido Peritoneal"],
      ["Líquido Pericárdico"],
      ["Líquido Sinovial"],
      ["Líquor"],
    ]),
  },
  {
    id: "gasometria",
    nome: "Gasometria",
    itens: mk("gas", [["Gasometria Venosa"], ["Gasometria Arterial"]]),
  },
];

export function todosItens(): ExameItem[] {
  const out: ExameItem[] = [];
  for (const cat of categoriasExames) {
    if (cat.itens) out.push(...cat.itens);
    if (cat.subgrupos) for (const s of cat.subgrupos) out.push(...s.itens);
  }
  return out;
}

export function itensDaCategoria(cat: ExameCategoria): ExameItem[] {
  if (cat.itens) return cat.itens;
  return cat.subgrupos?.flatMap((s) => s.itens) ?? [];
}

export function labelExame(id: string): string {
  return todosItens().find((i) => i.id === id)?.label ?? id;
}

// Perfis favoritos (IDs referem-se aos gerados por mk())
export interface PerfilFavorito {
  id: string;
  nome: string;
  descricao: string;
  itens: string[];
}

const idsPor = (labels: string[]): string[] => {
  const all = todosItens();
  return labels
    .map((l) => all.find((i) => i.label === l)?.id)
    .filter((v): v is string => Boolean(v));
};

export const perfisFavoritos: PerfilFavorito[] = [
  {
    id: "checkup-canino",
    nome: "Check-up Canino",
    descricao: "Avaliação clínica geral para cães.",
    itens: idsPor([
      "Hemograma completo",
      "Ureia",
      "Creatinina",
      "ALT (TGP)",
      "Fosfatase Alcalina (FA)",
      "Glicose",
      "Urina Tipo I",
    ]),
  },
  {
    id: "checkup-felino",
    nome: "Check-up Felino",
    descricao: "Perfil de rotina para gatos, incluindo triagem retroviral.",
    itens: idsPor([
      "Hemograma completo",
      "Ureia",
      "Creatinina",
      "SDMA",
      "ALT (TGP)",
      "T4 Total",
      "Urina Tipo I",
      "FIV/FeLV",
    ]),
  },
  {
    id: "pre-op",
    nome: "Pré-operatório",
    descricao: "Avaliação de risco anestésico-cirúrgico.",
    itens: idsPor([
      "Hemograma completo",
      "Ureia",
      "Creatinina",
      "ALT (TGP)",
      "Fosfatase Alcalina (FA)",
      "Glicose",
      "Proteínas Totais",
      "TP",
      "TTPA",
    ]),
  },
  {
    id: "renal",
    nome: "Doença Renal",
    descricao: "Estadiamento e acompanhamento IRIS.",
    itens: idsPor([
      "Ureia",
      "Creatinina",
      "SDMA",
      "Fósforo",
      "Cálcio Total",
      "Urina Tipo I",
      "Relação Proteína/Creatinina Urinária (UPC)",
      "Densidade Urinária",
    ]),
  },
  {
    id: "hepatopatia",
    nome: "Hepatopatia",
    descricao: "Investigação de disfunção hepática.",
    itens: idsPor([
      "ALT (TGP)",
      "AST (TGO)",
      "Fosfatase Alcalina (FA)",
      "GGT",
      "Bilirrubina Total",
      "Bilirrubina Direta",
      "Ácidos Biliares",
      "Albumina",
    ]),
  },
  {
    id: "emergencia",
    nome: "Emergência",
    descricao: "Painel rápido para paciente crítico.",
    itens: idsPor([
      "Hemograma completo",
      "Glicose",
      "Lactato",
      "Ureia",
      "Creatinina",
      "Sódio",
      "Potássio",
      "Gasometria Venosa",
    ]),
  },
];
