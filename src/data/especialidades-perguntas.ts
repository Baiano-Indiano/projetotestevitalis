import type { EspecialidadeId } from "@/config/municipio";
import { Heart, Sparkles, Bone, Stethoscope, Activity, Microscope, FlaskConical, type LucideIcon } from "lucide-react";

export type TipoPergunta = "simnao" | "checkbox" | "select" | "slider" | "textarea";

export interface Pergunta {
  id: string;
  tipo: TipoPergunta;
  label: string;
  opcoes?: string[]; // para checkbox / select
  placeholder?: string;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  obrigatorio?: boolean;
}

export interface BlocoEspecialidade {
  id: EspecialidadeId | "geral";
  nome: string;
  titulo: string;
  subtitulo: string;
  icone: LucideIcon;
  perguntas: Pergunta[];
}

const tempoOpcoes = ["Menos de 24h", "1 a 3 dias", "Mais de uma semana", "Meses"];
const tempoOpcoesSelect = ["Selecione uma opção", ...tempoOpcoes];

export const blocosEspecialidade: Partial<Record<EspecialidadeId | "geral", BlocoEspecialidade>> = {
  cardiologia: {
    id: "cardiologia",
    nome: "Cardiologia",
    titulo: "Avaliação Cardiológica",
    subtitulo: "Preencha os dados clínicos para encaminhamento.",
    icone: Heart,
    perguntas: [
      { id: "cansaco", tipo: "simnao", label: "O animal apresenta cansaço excessivo?" },
      { id: "respirar", tipo: "simnao", label: "Existe dificuldade para respirar?" },
      { id: "tosse", tipo: "checkbox", label: "Há episódios de tosse frequente? (Selecione todas aplicáveis)", opcoes: ["Seca", "Produtiva", "À noite", "Após esforço"] },
      { id: "desmaio", tipo: "simnao", label: "O animal desmaia ou perde equilíbrio?" },
      { id: "intensidade", tipo: "slider", label: "Intensidade geral dos sinais clínicos (1 a 5)", min: 1, max: 5, minLabel: "Leve (1)", maxLabel: "Grave/Urgente (5)" },
      { id: "tempo", tipo: "select", label: "Há quanto tempo os sinais clínicos começaram?", opcoes: tempoOpcoesSelect },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais", placeholder: "Descreva outros sinais clínicos, comportamentos incomuns ou medicações em uso..." },
    ],
  },
  dermatologia: {
    id: "dermatologia",
    nome: "Dermatologia",
    titulo: "Sinais Clínicos Dermatológicos",
    subtitulo: "Informações detalhadas sobre a pele e pelos do seu pet.",
    icone: Sparkles,
    perguntas: [
      { id: "coceira", tipo: "simnao", label: "O animal está com coceira?" },
      { id: "sinais", tipo: "checkbox", label: "Sinais observados:", opcoes: ["Queda de pelos", "Feridas", "Manchas", "Vermelhidão", "Secreção", "Odor forte"] },
      { id: "regiao", tipo: "select", label: "Região do corpo afetada:", opcoes: ["Selecione a região principal", "Cabeça e orelhas", "Tronco", "Membros", "Cauda", "Generalizada"] },
      { id: "tempo", tipo: "checkbox", label: "Tempo de início dos sintomas:", opcoes: tempoOpcoes },
      { id: "desconforto", tipo: "simnao", label: "Desconforto constante?" },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais (Opcional)", placeholder: "Descreva qualquer outro sinal clínico ou detalhe relevante..." },
    ],
  },
  ortopedia: {
    id: "ortopedia",
    nome: "Ortopedia",
    titulo: "Avaliação Ortopédica",
    subtitulo: "Detalhes sobre locomoção e dor.",
    icone: Bone,
    perguntas: [
      { id: "manqueira", tipo: "simnao", label: "O animal apresenta manqueira?" },
      { id: "membro", tipo: "select", label: "Qual membro está afetado?", opcoes: ["Selecione", "Anterior direito", "Anterior esquerdo", "Posterior direito", "Posterior esquerdo", "Múltiplos"] },
      { id: "trauma", tipo: "simnao", label: "Houve trauma recente (queda, atropelamento)?" },
      { id: "dor", tipo: "slider", label: "Intensidade da dor ao toque (1 a 5)", min: 1, max: 5, minLabel: "Leve (1)", maxLabel: "Grave/Urgente (5)" },
      { id: "tempo", tipo: "select", label: "Há quanto tempo começou?", opcoes: tempoOpcoesSelect },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais", placeholder: "Descreva o ocorrido com suas palavras..." },
    ],
  },
  traumatologia: {
    id: "traumatologia",
    nome: "Traumatologia",
    titulo: "Avaliação de Trauma",
    subtitulo: "Detalhes sobre o ocorrido para encaminhamento.",
    icone: Activity,
    perguntas: [
      { id: "tipo", tipo: "select", label: "Tipo de trauma:", opcoes: ["Selecione", "Atropelamento", "Queda", "Mordedura", "Outro"] },
      { id: "sangramento", tipo: "simnao", label: "Há sangramento ativo?" },
      { id: "consciencia", tipo: "select", label: "Nível de consciência:", opcoes: ["Selecione", "Alerta", "Apático", "Inconsciente"] },
      { id: "intensidade", tipo: "slider", label: "Gravidade aparente (1 a 5)", min: 1, max: 5, minLabel: "Leve", maxLabel: "Grave/Urgente" },
      { id: "tempo", tipo: "select", label: "Há quanto tempo aconteceu?", opcoes: ["Selecione", "Menos de 1h", "1 a 3h", "Mais de 3h"] },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais", placeholder: "Descreva o que aconteceu..." },
    ],
  },
  nefrologia: {
    id: "nefrologia",
    nome: "Nefrologia",
    titulo: "Avaliação Renal e Urinária",
    subtitulo: "Hábitos urinários e sinais sistêmicos.",
    icone: FlaskConical,
    perguntas: [
      { id: "urina-volume", tipo: "select", label: "Volume de urina:", opcoes: ["Selecione", "Normal", "Aumentado", "Reduzido", "Ausente"] },
      { id: "sede", tipo: "simnao", label: "Aumento de sede?" },
      { id: "vomito", tipo: "simnao", label: "Episódios de vômito?" },
      { id: "peso", tipo: "simnao", label: "Perda de peso recente?" },
      { id: "intensidade", tipo: "slider", label: "Intensidade dos sinais (1 a 5)", min: 1, max: 5, minLabel: "Leve", maxLabel: "Grave/Urgente" },
      { id: "tempo", tipo: "select", label: "Há quanto tempo?", opcoes: tempoOpcoesSelect },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais", placeholder: "Descreva detalhes adicionais..." },
    ],
  },
  oncologia: {
    id: "oncologia",
    nome: "Oncologia",
    titulo: "Avaliação Oncológica",
    subtitulo: "Detalhes sobre o nódulo ou alteração observada.",
    icone: Microscope,
    perguntas: [
      { id: "nodulo", tipo: "simnao", label: "Há nódulo ou massa palpável?" },
      { id: "regiao", tipo: "select", label: "Região:", opcoes: ["Selecione", "Cabeça", "Tórax", "Abdome", "Membros", "Mamária", "Outro"] },
      { id: "crescimento", tipo: "select", label: "Crescimento:", opcoes: ["Selecione", "Rápido (semanas)", "Lento (meses)", "Não sei"] },
      { id: "peso", tipo: "simnao", label: "Perda de peso?" },
      { id: "tempo", tipo: "select", label: "Há quanto tempo apareceu?", opcoes: tempoOpcoesSelect },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais", placeholder: "Descreva detalhes..." },
    ],
  },
  endocrinologia: {
    id: "endocrinologia",
    nome: "Endocrinologia",
    titulo: "Avaliação Endócrina",
    subtitulo: "Alterações de apetite, peso e comportamento.",
    icone: Stethoscope,
    perguntas: [
      { id: "sede", tipo: "simnao", label: "Aumento de sede?" },
      { id: "apetite", tipo: "select", label: "Apetite:", opcoes: ["Selecione", "Normal", "Aumentado", "Reduzido", "Ausente"] },
      { id: "peso", tipo: "select", label: "Peso:", opcoes: ["Selecione", "Estável", "Perda", "Ganho"] },
      { id: "pelagem", tipo: "simnao", label: "Alteração de pelagem?" },
      { id: "tempo", tipo: "select", label: "Há quanto tempo?", opcoes: tempoOpcoesSelect },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais", placeholder: "Descreva detalhes..." },
    ],
  },
  geral: {
    id: "geral",
    nome: "Clínica Geral",
    titulo: "Avaliação Clínica Geral",
    subtitulo: "Conte mais sobre o que está acontecendo.",
    icone: Stethoscope,
    perguntas: [
      { id: "consciencia", tipo: "select", label: "Como está o animal agora?", opcoes: ["Selecione", "Alerta", "Apático", "Deprimido", "Inconsciente"] },
      { id: "apetite", tipo: "select", label: "Apetite:", opcoes: ["Selecione", "Normal", "Reduzido", "Ausente"] },
      { id: "sintomas", tipo: "checkbox", label: "Sinais observados:", opcoes: ["Vômito", "Diarreia", "Febre", "Tremor", "Letargia", "Outro"] },
      { id: "intensidade", tipo: "slider", label: "Intensidade dos sinais (1 a 5)", min: 1, max: 5, minLabel: "Leve", maxLabel: "Grave/Urgente" },
      { id: "tempo", tipo: "select", label: "Há quanto tempo?", opcoes: tempoOpcoesSelect },
      { id: "obs", tipo: "textarea", label: "Observações Adicionais", placeholder: "Descreva detalhes relevantes..." },
    ],
  },
};

export const motivosConsulta: { id: EspecialidadeId | "geral"; label: string; desc: string }[] = [
  { id: "geral", label: "Clínica Geral / Sintomas diversos", desc: "Vômito, diarreia, febre, apatia." },
  { id: "dermatologia", label: "Pele, pelos ou orelhas", desc: "Coceira, queda de pelo, feridas." },
  { id: "cardiologia", label: "Respiração ou coração", desc: "Tosse, cansaço, dificuldade para respirar." },
  { id: "ortopedia", label: "Locomoção ou dor", desc: "Manqueira, dor ao andar." },
  { id: "traumatologia", label: "Trauma recente", desc: "Queda, atropelamento, mordedura." },
  { id: "nefrologia", label: "Urina ou sede excessiva", desc: "Bebe muita água, urina demais." },
  { id: "oncologia", label: "Caroço ou nódulo", desc: "Massa palpável, emagrecimento." },
  { id: "endocrinologia", label: "Alterações de peso ou apetite", desc: "Ganho ou perda de peso sem causa clara." },
];
