import type { EspecialidadeId } from "@/config/municipio";

export interface Sintoma {
  id: string;
  nome: string;
  sistema: "pele" | "respiratorio" | "cardio" | "urinario" | "digestivo" | "locomotor" | "geral" | "neuro";
  pesos: Partial<Record<EspecialidadeId, number>>;
  redFlag?: boolean;
}

export const sintomas: Sintoma[] = [
  { id: "prurido", nome: "Coceira intensa", sistema: "pele", pesos: { dermatologia: 5 } },
  { id: "alopecia", nome: "Queda de pelo", sistema: "pele", pesos: { dermatologia: 4 } },
  { id: "otite", nome: "Otite, orelha inflamada", sistema: "pele", pesos: { dermatologia: 3 } },
  { id: "poliuria", nome: "Urina em excesso", sistema: "urinario", pesos: { nefrologia: 5, endocrinologia: 2 } },
  { id: "sede", nome: "Aumento de sede", sistema: "geral", pesos: { nefrologia: 3, endocrinologia: 3 } },
  { id: "perda-peso", nome: "Perda de peso", sistema: "geral", pesos: { oncologia: 3, nefrologia: 2, endocrinologia: 2 } },
  { id: "vomito-cronico", nome: "Vômito recorrente", sistema: "digestivo", pesos: { nefrologia: 3, oncologia: 2 } },
  { id: "dispneia", nome: "Dificuldade para respirar", sistema: "respiratorio", pesos: { cardiologia: 5 }, redFlag: true },
  { id: "cansaco", nome: "Cansaço aos esforços", sistema: "cardio", pesos: { cardiologia: 4 } },
  { id: "tosse", nome: "Tosse", sistema: "respiratorio", pesos: { cardiologia: 3 } },
  { id: "claudicacao", nome: "Manqueira", sistema: "locomotor", pesos: { ortopedia: 5, traumatologia: 3 } },
  { id: "dor-membro", nome: "Dor ao manipular membro", sistema: "locomotor", pesos: { ortopedia: 4, traumatologia: 4 } },
  { id: "trauma", nome: "Trauma recente, queda ou atropelamento", sistema: "locomotor", pesos: { traumatologia: 5 } },
  { id: "nodulo", nome: "Nódulo ou massa palpável", sistema: "geral", pesos: { oncologia: 5 } },
  { id: "convulsao", nome: "Convulsão", sistema: "neuro", pesos: {}, redFlag: true },
  { id: "sangramento", nome: "Sangramento ativo", sistema: "geral", pesos: { traumatologia: 3 }, redFlag: true },
  { id: "distensao", nome: "Abdome distendido de início agudo", sistema: "digestivo", pesos: {}, redFlag: true },
  { id: "colapso", nome: "Colapso ou desmaio", sistema: "cardio", pesos: { cardiologia: 3 }, redFlag: true },
  { id: "toxico", nome: "Ingestão de substância tóxica", sistema: "geral", pesos: {}, redFlag: true },
  { id: "anuria", nome: "Ausência de urina por mais de 24h", sistema: "urinario", pesos: { nefrologia: 3 }, redFlag: true },
  { id: "mucosa-palida", nome: "Mucosa pálida ou azulada", sistema: "geral", pesos: {}, redFlag: true },
];

export const sintomaPorId = (id: string) => sintomas.find((s) => s.id === id);

export const sistemasLabel: Record<Sintoma["sistema"], string> = {
  pele: "Pele e orelhas",
  respiratorio: "Respiratório",
  cardio: "Cardiovascular",
  urinario: "Urinário",
  digestivo: "Digestivo",
  locomotor: "Locomotor",
  geral: "Sinais gerais",
  neuro: "Neurológico",
};

// Mapa de palavras-chave para inferir sintomas a partir de texto livre.
// Simula uma camada de IA. Substituir por chamada a modelo real depois.
export const inferirSintomas = (texto: string): string[] => {
  const t = texto.toLowerCase();
  const hits: string[] = [];
  const map: Record<string, string> = {
    "coçando": "prurido", "coceira": "prurido", "se coça": "prurido",
    "queda de pelo": "alopecia", "pelado": "alopecia", "sem pelo": "alopecia",
    "orelha": "otite",
    "muita urina": "poliuria", "urinando muito": "poliuria", "xixi demais": "poliuria",
    "muita sede": "sede", "bebe muita água": "sede", "bebendo muito": "sede",
    "emagreceu": "perda-peso", "perdeu peso": "perda-peso", "magro": "perda-peso",
    "vomitando": "vomito-cronico", "vômito": "vomito-cronico", "vomito": "vomito-cronico",
    "respirando rápido": "dispneia", "ofegante": "dispneia", "falta de ar": "dispneia",
    "cansado": "cansaco", "cansa fácil": "cansaco",
    "tosse": "tosse", "tossindo": "tosse",
    "mancando": "claudicacao", "manca": "claudicacao",
    "dor na pata": "dor-membro", "dor na perna": "dor-membro",
    "atropelado": "trauma", "caiu": "trauma", "trauma": "trauma",
    "caroço": "nodulo", "nódulo": "nodulo", "massa": "nodulo", "bolinha": "nodulo",
    "convulsão": "convulsao", "convulsao": "convulsao", "tremendo": "convulsao",
    "sangrando": "sangramento", "sangue": "sangramento",
    "barriga inchada": "distensao", "abdome": "distensao",
    "desmaiou": "colapso", "caiu desmaiado": "colapso",
    "comeu veneno": "toxico", "intoxicado": "toxico", "tóxico": "toxico",
    "não urina": "anuria", "sem urinar": "anuria",
    "mucosa pálida": "mucosa-palida", "gengiva branca": "mucosa-palida", "roxa": "mucosa-palida",
  };
  for (const [chave, id] of Object.entries(map)) {
    if (t.includes(chave) && !hits.includes(id)) hits.push(id);
  }
  return hits;
};
