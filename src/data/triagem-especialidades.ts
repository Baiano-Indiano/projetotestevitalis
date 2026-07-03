import {
  Heart,
  Sparkles,
  Activity,
  Droplet,
  Briefcase,
  Bone,
  type LucideIcon,
} from "lucide-react";

export type EspecialidadeTriagemId =
  | "cardiologia"
  | "dermatologia"
  | "endocrinologia"
  | "nefrologia"
  | "oncologia"
  | "ortopedia";

export type Pergunta =
  | { id: string; tipo: "simnao"; label: string }
  | { id: string; tipo: "checkbox"; label: string; opcoes: string[] }
  | { id: string; tipo: "select"; label: string; opcoes: string[]; placeholder?: string }
  | { id: string; tipo: "radio-vertical"; label: string; opcoes: string[] }
  | { id: string; tipo: "slider"; label: string; min?: number; max?: number; minLabel?: string; maxLabel?: string }
  | { id: string; tipo: "textarea"; label: string; placeholder?: string };

export interface BlocoEspecialidadeTriagem {
  id: EspecialidadeTriagemId;
  nome: string; // tab label
  titulo: string;
  subtitulo: string;
  icone: LucideIcon;
  corIconeBg: string;
  corIcone: string;
  perguntas: Pergunta[];
}

const tempoOpcoes = ["Menos de 24h", "1 a 3 dias", "Mais de uma semana", "Meses"];
const tempoSelect = ["Selecione uma opção", ...tempoOpcoes];

export const blocosTriagem: BlocoEspecialidadeTriagem[] = [
  {
    id: "cardiologia",
    nome: "Cardiologia",
    titulo: "Avaliação Cardiológica",
    subtitulo: "Preencha os dados clínicos para encaminhamento.",
    icone: Heart,
    corIconeBg: "bg-red-50",
    corIcone: "text-red-500",
    perguntas: [
      { id: "cansaco", tipo: "simnao", label: "O animal apresenta cansaço excessivo?" },
      { id: "respirar", tipo: "simnao", label: "Existe dificuldade para respirar?" },
      {
        id: "tosse",
        tipo: "checkbox",
        label: "Há episódios de tosse frequente? (Selecione todas aplicáveis)",
        opcoes: ["Seca", "Produtiva", "À noite", "Após esforço"],
      },
      {
        id: "desmaio",
        tipo: "checkbox",
        label: "O animal apresenta algum destes sinais? (Selecione todos aplicáveis)",
        opcoes: ["Desmaia", "Perde o equilíbrio", "Nenhum dos anteriores"],
      },
      { id: "intensidade", tipo: "slider", label: "Intensidade geral dos sinais clínicos (1 a 5)", min: 1, max: 5, minLabel: "Leve (1)", maxLabel: "Grave/Urgente (5)" },
      { id: "tempo", tipo: "select", label: "Há quanto tempo os sinais clínicos começaram?", opcoes: tempoSelect },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais", placeholder: "Descreva outros sinais clínicos, comportamentos incomuns ou medicações em uso..." },
    ],
  },
  {
    id: "dermatologia",
    nome: "Dermatologia",
    titulo: "Sinais Clínicos Dermatológicos",
    subtitulo: "Informações detalhadas sobre a pele e pelos do seu pet.",
    icone: Sparkles,
    corIconeBg: "bg-fuchsia-50",
    corIcone: "text-fuchsia-600",
    perguntas: [
      { id: "coceira", tipo: "simnao", label: "O animal está com coceira?" },
      { id: "sinais", tipo: "checkbox", label: "Sinais observados:", opcoes: ["Queda de pelos", "Feridas", "Manchas", "Vermelhidão", "Secreção", "Odor forte"] },
      { id: "regiao", tipo: "select", label: "Região do corpo afetada:", opcoes: ["Selecione a região principal", "Cabeça e orelhas", "Tronco", "Membros", "Cauda", "Generalizada"] },
      { id: "tempo", tipo: "radio-vertical", label: "Tempo de início dos sintomas:", opcoes: tempoOpcoes },
      { id: "desconforto", tipo: "simnao", label: "Desconforto constante?" },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais (Opcional)", placeholder: "Descreva qualquer outro sinal clínico ou detalhe relevante..." },
    ],
  },
  {
    id: "endocrinologia",
    nome: "Endocrinologia",
    titulo: "Avaliação Endocrinológica",
    subtitulo: "Alterações sistêmicas e comportamentais.",
    icone: Activity,
    corIconeBg: "bg-primary-50",
    corIcone: "text-primary",
    perguntas: [
      { id: "agua", tipo: "simnao", label: "O animal está bebendo mais água que o normal?" },
      {
        id: "peso",
        tipo: "checkbox",
        label: "Houve alteração de peso recentemente? (Selecione todas aplicáveis)",
        opcoes: ["Aumento de peso", "Perda de peso", "Sem alteração"],
      },
      { id: "apetite", tipo: "simnao", label: "Existe aumento excessivo do apetite?" },
      {
        id: "pelagem",
        tipo: "checkbox",
        label: "O animal apresenta alguma destas alterações? (Selecione todas aplicáveis)",
        opcoes: ["Queda de pelos", "Alterações na pele", "Nenhuma"],
      },
      {
        id: "comportamento",
        tipo: "checkbox",
        label: "Houve mudanças em algum dos itens abaixo? (Selecione todas aplicáveis)",
        opcoes: ["Comportamento", "Nível de energia", "Nenhuma mudança"],
      },
      { id: "urina", tipo: "simnao", label: "O animal urina com frequência aumentada?" },
      { id: "intensidade", tipo: "slider", label: "Intensidade geral dos sinais clínicos (1 a 5):", min: 1, max: 5, minLabel: "Leve (1)", maxLabel: "Grave/Urgente (5)" },
      { id: "tempo", tipo: "select", label: "Há quanto tempo os sinais clínicos começaram?", opcoes: tempoSelect },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais:", placeholder: "Descreva outros comportamentos incomuns ou medicações em uso..." },
    ],
  },
  {
    id: "nefrologia",
    nome: "Nefrologia",
    titulo: "Avaliação Nefrológica",
    subtitulo: "Preencha os detalhes clínicos do paciente.",
    icone: Droplet,
    corIconeBg: "bg-primary-50",
    corIcone: "text-primary",
    perguntas: [
      { id: "urina-freq", tipo: "simnao", label: "O animal está urinando com frequência aumentada?" },
      { id: "dor", tipo: "checkbox", label: "O animal apresenta algum destes sinais ao urinar? (Selecione todos aplicáveis)", opcoes: ["Dificuldade para urinar", "Dor ao urinar", "Nenhum"] },
      { id: "sangue", tipo: "simnao", label: "Houve presença de sangue na urina?" },
      { id: "agua", tipo: "simnao", label: "O animal está bebendo mais água que o normal?" },
      { id: "associados", tipo: "checkbox", label: "Sintomas associados:", opcoes: ["Perda de apetite", "Perda de peso", "Vômitos", "Apatia"] },
      { id: "intensidade", tipo: "slider", label: "Intensidade geral dos sinais clínicos (1 a 5):", min: 1, max: 5, minLabel: "Leve (1)", maxLabel: "Grave/Urgente (5)" },
      { id: "tempo", tipo: "select", label: "Há quanto tempo os sinais clínicos começaram?", opcoes: tempoSelect },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais:", placeholder: "Ex: Histórico de doenças renais prévias, medicamentos atuais..." },
    ],
  },
  {
    id: "oncologia",
    nome: "Oncologia",
    titulo: "Avaliação Oncológica",
    subtitulo: "Responda às perguntas sobre o estado de saúde do animal.",
    icone: Briefcase,
    corIconeBg: "bg-primary-50",
    corIcone: "text-primary",
    perguntas: [
      { id: "nodulos", tipo: "simnao", label: "O animal possui caroços ou nódulos visíveis?" },
      { id: "crescimento", tipo: "simnao", label: "Houve crescimento recente dessas alterações?" },
      { id: "dor", tipo: "checkbox", label: "O animal demonstra algum destes sinais na região? (Selecione todos aplicáveis)", opcoes: ["Dor", "Sensibilidade ao toque", "Nenhum"] },
      { id: "peso", tipo: "simnao", label: "Existe perda de peso sem causa aparente?" },
      { id: "apetite", tipo: "simnao", label: "Houve perda de apetite recentemente?" },
      { id: "associados", tipo: "checkbox", label: "Sinais clínicos associados:", opcoes: ["Cansaço excessivo", "Apatia", "Feridas que não cicatrizam"] },
      { id: "intensidade", tipo: "slider", label: "Intensidade geral dos sinais clínicos (1 a 5):", min: 1, max: 5, minLabel: "Leve (1)", maxLabel: "Grave/Urgente (5)" },
      { id: "tempo", tipo: "select", label: "Há quanto tempo os sinais clínicos foram percebidos?", opcoes: tempoSelect },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais:", placeholder: "Descreva qualquer outro detalhe importante..." },
    ],
  },
  {
    id: "ortopedia",
    nome: "Ortopedia",
    titulo: "Avaliação Ortopédica",
    subtitulo: "Detalhes sobre locomoção, dor e equilíbrio.",
    icone: Bone,
    corIconeBg: "bg-primary-50",
    corIcone: "text-primary",
    perguntas: [
      { id: "andar", tipo: "simnao", label: "O animal apresenta dificuldade para andar?" },
      { id: "mancar", tipo: "simnao", label: "Existe mancar ou perda de equilíbrio?" },
      { id: "trauma", tipo: "simnao", label: "Houve alguma queda, trauma ou acidente recente?" },
      { id: "dor", tipo: "simnao", label: "O animal demonstra dor ao se movimentar?" },
      { id: "inchaco", tipo: "simnao", label: "Existe inchaço em patas ou articulações?" },
      { id: "evita", tipo: "simnao", label: "O animal evita subir, correr ou pular?" },
      { id: "intensidade", tipo: "slider", label: "Intensidade da dor (1 a 5)", min: 1, max: 5, minLabel: "Leve (1)", maxLabel: "Grave/Urgente (5)" },
      { id: "regiao", tipo: "checkbox", label: "Qual região do corpo parece afetada?", opcoes: ["Pata Dianteira Direita", "Pata Dianteira Esquerda", "Pata Traseira Direita", "Pata Traseira Esquerda", "Coluna/Dorso"] },
      { id: "tempo", tipo: "select", label: "Há quanto tempo os sinais clínicos começaram?", opcoes: tempoSelect },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais", placeholder: "Descreva qualquer outro sinal clínico ou comportamento incomum..." },
    ],
  },
];

export type RespostasEspecialidades = Record<string, Record<string, unknown>>;
