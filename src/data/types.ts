import type { EspecialidadeId } from "@/config/municipio";

export type NivelTutor = "anonimo" | "identificado" | "verificado";
export type Especie = "cao" | "gato" | "outro";
export type CanalTriagem = "online" | "movel";
export type StatusTriagem = "pendente" | "validada" | "urgencia" | "redirecionada";
export type Prioridade = "alta" | "media" | "baixa";

export interface Tutor {
  id: string;
  nome: string;
  cpf?: string;
  telefone: string;
  email?: string;
  nivel: NivelTutor;
}

export interface Animal {
  id: string;
  tutorId: string;
  nome: string;
  especie: Especie;
  raca: string;
  sexo: "macho" | "femea";
  idade: string; // ex. "5 anos"
  microchip?: string;
}

export interface EtapasTriagem {
  estadoAtual?: {
    consciencia: "alerta" | "apatico" | "deprimido" | "inconsciente";
    apetite: "normal" | "reduzido" | "ausente";
    hidratacao: "normal" | "leve" | "moderada" | "grave";
    comportamento: "normal" | "agitado" | "isolado" | "agressivo";
  };
  sintomas: string[]; // ids de sintoma
  tempo?: {
    inicio: string; // ex. "ha 2 dias"
    duracao: string;
  };
  ambiente?: {
    ambiente: "domestico" | "rua" | "misto";
    contatoOutros: boolean;
    vacinado: boolean;
  };
  observacoes?: string;
  anexos?: { nome: string; url: string }[];
  chipsIA?: string[]; // sintomas inferidos do texto livre
}

export interface Triagem {
  id: string;
  protocolo: string; // ex. "TRG-2847"
  animal: Pick<Animal, "nome" | "especie" | "raca" | "sexo" | "idade">;
  tutor: Pick<Tutor, "nome" | "telefone">;
  canal: CanalTriagem;
  etapas: EtapasTriagem;
  redFlags: string[]; // ids
  scores: Partial<Record<EspecialidadeId, number>>;
  sugestao: EspecialidadeId | "urgencia";
  prioridade: Prioridade;
  status: StatusTriagem;
  criadoEm: string; // ISO
  unidadeId?: string;
}

export interface ValidacaoDecisao {
  triagemId: string;
  veterinario: string;
  acao: "confirmar" | "redirecionar" | "urgencia";
  especialidadeFinal: EspecialidadeId | "urgencia";
  observacao?: string;
  concordanciaIA: boolean;
  decididoEm: string;
}

export interface Agendamento {
  id: string;
  protocolo: string; // ex. "AG-2026-000001"
  especialidadeId: string;
  especialidadeNome: string;
  dataISO: string; // YYYY-MM-DD
  horario: string; // HH:mm
  criadoEm: string; // ISO
}
