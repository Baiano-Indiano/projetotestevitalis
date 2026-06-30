import { type ReactNode } from "react";
import { create, type StateCreator } from "zustand";
import { calcularMotor, gerarProtocolo, gerarProtocoloAgendamento } from "@/lib/triagem";
import type {
  Triagem,
  ValidacaoDecisao,
  Agendamento,
  StatusAgendamento,
  Papel,
  RascunhoTriagem,
  RegistroAnamnese,
  RegistroExameFisico,
  RegistroDiagnostico,
  RegistroPrescricao,
  RegistroEvolucaoSOAP,
  Internacao,
  StatusInternacao,
} from "@/data/types";

import { veterinarios } from "@/data/veterinarios";
import { nomeEspecialidade } from "@/config/municipio";

// Re-export for backward compatibility
export type { Papel } from "@/data/types";

// =================================================================
// SEEDS (mantidos exatamente como antes para não quebrar protótipos)
// =================================================================
const minutosAtras = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

const seedTriagens: Triagem[] = [
  (() => {
    const sintomas = ["dispneia", "mucosa-palida", "cansaco"];
    const r = calcularMotor(sintomas);
    return {
      id: "t-001",
      protocolo: gerarProtocolo(47),
      animal: { nome: "Thor", especie: "cao", raca: "Rottweiler", sexo: "macho", idade: "8 anos" },
      tutor: { nome: "Marina Albuquerque", telefone: "(91) 99102 4411" },
      canal: "online",
      etapas: {
        sintomas,
        estadoAtual: { consciencia: "apatico", apetite: "ausente", hidratacao: "moderada", comportamento: "isolado" },
        tempo: { inicio: "há 3 horas", duracao: "agudo" },
        ambiente: { ambiente: "domestico", contatoOutros: false, vacinado: true },
        observacoes: "Animal está ofegante desde a manhã, gengiva muito pálida. Não quer levantar.",
        chipsIA: ["dispneia", "mucosa-palida"],
      },
      redFlags: r.redFlags,
      scores: r.scores,
      sugestao: r.sugestao,
      prioridade: r.prioridade,
      status: "pendente",
      criadoEm: minutosAtras(6),
    };
  })(),
  (() => {
    const sintomas = ["claudicacao", "dor-membro", "trauma"];
    const r = calcularMotor(sintomas);
    return {
      id: "t-002",
      protocolo: gerarProtocolo(48),
      animal: { nome: "Mel", especie: "cao", raca: "SRD", sexo: "femea", idade: "4 anos" },
      tutor: { nome: "Rafael Lopes Maia", telefone: "(91) 98231 7720" },
      canal: "movel",
      etapas: {
        sintomas,
        estadoAtual: { consciencia: "alerta", apetite: "reduzido", hidratacao: "normal", comportamento: "agitado" },
        tempo: { inicio: "há 1 dia", duracao: "agudo" },
        ambiente: { ambiente: "rua", contatoOutros: true, vacinado: false },
        observacoes: "Mancando da pata traseira esquerda após queda em obra. Não suporta o peso.",
        chipsIA: ["claudicacao", "trauma"],
      },
      redFlags: r.redFlags,
      scores: r.scores,
      sugestao: r.sugestao,
      prioridade: r.prioridade,
      status: "pendente",
      criadoEm: minutosAtras(22),
    };
  })(),
  (() => {
    const sintomas = ["poliuria", "sede", "perda-peso"];
    const r = calcularMotor(sintomas);
    return {
      id: "t-003",
      protocolo: gerarProtocolo(49),
      animal: { nome: "Pituca", especie: "gato", raca: "SRD", sexo: "femea", idade: "12 anos" },
      tutor: { nome: "Cláudia Bezerra", telefone: "(91) 99877 1240" },
      canal: "online",
      etapas: {
        sintomas,
        estadoAtual: { consciencia: "alerta", apetite: "reduzido", hidratacao: "leve", comportamento: "normal" },
        tempo: { inicio: "há 3 semanas", duracao: "crônico" },
        ambiente: { ambiente: "domestico", contatoOutros: false, vacinado: true },
        observacoes: "Bebendo muita água, urinando demais e perdeu peso. Caixa de areia cheia em poucas horas.",
        chipsIA: ["poliuria", "sede", "perda-peso"],
      },
      redFlags: r.redFlags,
      scores: r.scores,
      sugestao: r.sugestao,
      prioridade: r.prioridade,
      status: "pendente",
      criadoEm: minutosAtras(38),
    };
  })(),
  (() => {
    const sintomas = ["prurido", "alopecia", "otite"];
    const r = calcularMotor(sintomas);
    return {
      id: "t-004",
      protocolo: gerarProtocolo(50),
      animal: { nome: "Bento", especie: "cao", raca: "Labrador", sexo: "macho", idade: "3 anos" },
      tutor: { nome: "Henrique Sales", telefone: "(91) 99440 2218" },
      canal: "online",
      etapas: {
        sintomas,
        estadoAtual: { consciencia: "alerta", apetite: "normal", hidratacao: "normal", comportamento: "normal" },
        tempo: { inicio: "há 2 semanas", duracao: "crônico" },
        ambiente: { ambiente: "domestico", contatoOutros: true, vacinado: true },
        observacoes: "Coçando muito o corpo todo, com queda de pelo e orelha vermelha.",
        chipsIA: ["prurido", "alopecia", "otite"],
      },
      redFlags: r.redFlags,
      scores: r.scores,
      sugestao: r.sugestao,
      prioridade: r.prioridade,
      status: "pendente",
      criadoEm: minutosAtras(54),
    };
  })(),
  (() => {
    const sintomas = ["nodulo", "perda-peso"];
    const r = calcularMotor(sintomas);
    return {
      id: "t-005",
      protocolo: gerarProtocolo(51),
      animal: { nome: "Lola", especie: "cao", raca: "Boxer", sexo: "femea", idade: "10 anos" },
      tutor: { nome: "Patrícia Andrade", telefone: "(91) 98112 3389" },
      canal: "online",
      etapas: {
        sintomas,
        estadoAtual: { consciencia: "alerta", apetite: "reduzido", hidratacao: "normal", comportamento: "normal" },
        tempo: { inicio: "há 2 meses", duracao: "crônico" },
        ambiente: { ambiente: "domestico", contatoOutros: false, vacinado: true },
        observacoes: "Apareceu um caroço firme no peito que está crescendo. Emagreceu.",
        chipsIA: ["nodulo", "perda-peso"],
      },
      redFlags: r.redFlags,
      scores: r.scores,
      sugestao: r.sugestao,
      prioridade: r.prioridade,
      status: "pendente",
      criadoEm: minutosAtras(73),
    };
  })(),
  (() => {
    const sintomas = ["tosse", "cansaco"];
    const r = calcularMotor(sintomas);
    return {
      id: "t-006",
      protocolo: gerarProtocolo(52),
      animal: { nome: "Theo", especie: "cao", raca: "Poodle", sexo: "macho", idade: "11 anos" },
      tutor: { nome: "Eduardo Moraes", telefone: "(91) 99203 5566" },
      canal: "movel",
      etapas: {
        sintomas,
        estadoAtual: { consciencia: "alerta", apetite: "normal", hidratacao: "normal", comportamento: "normal" },
        tempo: { inicio: "há 1 semana", duracao: "subagudo" },
        ambiente: { ambiente: "domestico", contatoOutros: false, vacinado: true },
        observacoes: "Tosse seca à noite e cansa rápido em caminhadas curtas.",
        chipsIA: ["tosse", "cansaco"],
      },
      redFlags: r.redFlags,
      scores: r.scores,
      sugestao: r.sugestao,
      prioridade: r.prioridade,
      status: "pendente",
      criadoEm: minutosAtras(91),
    };
  })(),
];

const hojeISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const amanhaISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const seedAgs: Agendamento[] = [
  { vet: "vet-rs", h: "08:00", tutor: "Marina Albuquerque", animal: "Thor", st: "confirmado", obs: "Retorno cardiológico" },
  { vet: "vet-rs", h: "09:00", tutor: "Carla Dias", animal: "Bidu", st: "check-in" },
  { vet: "vet-am", h: "08:30", tutor: "Roberto Pinto", animal: "Luna", st: "em-atendimento" },
  { vet: "vet-am", h: "10:00", tutor: "Eduardo Lima", animal: "Theo", st: "pendente" },
  { vet: "vet-ms", h: "09:30", tutor: "Rafael Lopes Maia", animal: "Mel", st: "confirmado", obs: "Pós-cirúrgico" },
  { vet: "vet-cl", h: "11:00", tutor: "Henrique Sales", animal: "Bento", st: "confirmado" },
  { vet: "vet-jp", h: "14:00", tutor: "Cláudia Bezerra", animal: "Pituca", st: "pendente" },
  { vet: "vet-jp", h: "15:30", tutor: "Sandra Mota", animal: "Nina", st: "confirmado" },
  { vet: "vet-rs", h: "16:00", tutor: "Paulo Reis", animal: "Rex", st: "concluido" },
].map((s, i) => {
  const v = veterinarios.find((x) => x.id === s.vet)!;
  return {
    id: `ag-seed-${i}`,
    protocolo: gerarProtocoloAgendamento(),
    especialidadeId: v.especialidadeId,
    especialidadeNome: nomeEspecialidade(v.especialidadeId),
    dataISO: i % 4 === 3 ? amanhaISO() : hojeISO(),
    horario: s.h,
    criadoEm: new Date().toISOString(),
    status: s.st as StatusAgendamento,
    profissionalId: v.id,
    profissionalNome: v.nome,
    unidadeId: v.unidadeId,
    tutorNome: s.tutor,
    animalNome: s.animal,
    duracaoMin: 30,
    observacoes: s.obs,
  } satisfies Agendamento;
});

// =================================================================
// SLICES
// =================================================================
let seq = 100;

export interface TutorSlice {
  papel: Papel;
  setPapel: (p: Papel) => void;
  rascunho: RascunhoTriagem;
  setRascunho: (r: RascunhoTriagem) => void;
  resetRascunho: () => void;
  agendamentos: Agendamento[];
  criarAgendamento: (parcial: Omit<Agendamento, "id" | "protocolo" | "criadoEm">) => Agendamento;
  atualizarStatusAgendamento: (id: string, status: StatusAgendamento) => void;
  removerAgendamento: (id: string) => void;
  ultimoAgendamentoId?: string;
  setUltimoAgendamentoId: (id?: string) => void;
}

export interface TriagemSlice {
  triagens: Triagem[];
  decisoes: ValidacaoDecisao[];
  adicionarTriagem: (parcial: Omit<Triagem, "id" | "protocolo" | "criadoEm" | "status">) => Triagem;
  decidir: (d: ValidacaoDecisao) => void;
  ultimaTriagemId?: string;
  setUltimaTriagemId: (id?: string) => void;
}

export interface ProntuarioSlice {
  anamneses: RegistroAnamnese[];
  examesFisicos: RegistroExameFisico[];
  diagnosticos: RegistroDiagnostico[];
  prescricoes: RegistroPrescricao[];
  evolucoesSOAP: RegistroEvolucaoSOAP[];
  internacoes: Internacao[];
  salvarAnamnese: (r: Omit<RegistroAnamnese, "id" | "criadoEm">) => RegistroAnamnese;
  salvarExameFisico: (r: Omit<RegistroExameFisico, "id" | "criadoEm">) => RegistroExameFisico;
  salvarDiagnostico: (r: Omit<RegistroDiagnostico, "id" | "criadoEm">) => RegistroDiagnostico;
  salvarPrescricao: (r: Omit<RegistroPrescricao, "id" | "criadoEm">) => RegistroPrescricao;
  salvarEvolucaoSOAP: (r: Omit<RegistroEvolucaoSOAP, "id" | "criadoEm">) => RegistroEvolucaoSOAP;
  adicionarInternacao: (r: Omit<Internacao, "id" | "criadoEm" | "status"> & { status?: StatusInternacao }) => Internacao;
  alterarStatusInternacao: (id: string, status: StatusInternacao) => void;
}

export type RootState = TutorSlice & TriagemSlice & ProntuarioSlice;


const createTutorSlice: StateCreator<RootState, [], [], TutorSlice> = (set) => ({
  papel: "tutor",
  setPapel: (papel) => set({ papel }),
  rascunho: { sintomas: [] },
  setRascunho: (rascunho) => set({ rascunho }),
  resetRascunho: () => set({ rascunho: { sintomas: [] } }),
  agendamentos: seedAgs,
  criarAgendamento: (parcial) => {
    const a: Agendamento = {
      ...parcial,
      id: `ag-${Date.now().toString(36)}`,
      protocolo: gerarProtocoloAgendamento(),
      criadoEm: new Date().toISOString(),
    };
    set((s) => ({ agendamentos: [a, ...s.agendamentos] }));
    return a;
  },
  atualizarStatusAgendamento: (id, status) =>
    set((s) => ({
      agendamentos: s.agendamentos.map((a) => (a.id === id ? { ...a, status } : a)),
    })),
  removerAgendamento: (id) =>
    set((s) => ({ agendamentos: s.agendamentos.filter((a) => a.id !== id) })),
  ultimoAgendamentoId: undefined,
  setUltimoAgendamentoId: (ultimoAgendamentoId) => set({ ultimoAgendamentoId }),
});

const createTriagemSlice: StateCreator<RootState, [], [], TriagemSlice> = (set) => ({
  triagens: seedTriagens,
  decisoes: [],
  adicionarTriagem: (parcial) => {
    const t: Triagem = {
      ...parcial,
      id: `t-${(++seq).toString().padStart(3, "0")}`,
      protocolo: gerarProtocolo(seq),
      criadoEm: new Date().toISOString(),
      status: parcial.redFlags.length > 0 ? "urgencia" : "pendente",
    };
    set((s) => ({ triagens: [t, ...s.triagens] }));
    return t;
  },
  decidir: (d) =>
    set((s) => ({
      decisoes: [...s.decisoes, d],
      triagens: s.triagens.map((t) =>
        t.id === d.triagemId
          ? {
              ...t,
              status:
                d.acao === "urgencia"
                  ? "urgencia"
                  : d.acao === "redirecionar"
                    ? "redirecionada"
                    : "validada",
            }
          : t,
      ),
    })),
  ultimaTriagemId: undefined,
  setUltimaTriagemId: (ultimaTriagemId) => set({ ultimaTriagemId }),
});

const novoRegistro = <T,>(r: T): T & { id: string; criadoEm: string } => ({
  ...r,
  id: crypto.randomUUID(),
  criadoEm: new Date().toISOString(),
});

const createProntuarioSlice: StateCreator<RootState, [], [], ProntuarioSlice> = (set) => ({
  anamneses: [],
  examesFisicos: [],
  diagnosticos: [],
  prescricoes: [],
  evolucoesSOAP: [
    {
      id: "soap-seed-1",
      pacienteId: "int-seed-1",
      criadoEm: minutosAtras(180),
      medico: "Dra. Mariana Lima",
      subjetivo: "Tutor relata melhora discreta do apetite na última refeição.",
      objetivo: "FC 120 bpm, FR 32 mpm, T 39,1 °C. Mucosas levemente pálidas. Hidratação 6%.",
      avaliacao: "Parvovirose em evolução favorável. Manter suporte intensivo.",
      plano: "Manter fluidoterapia, antieméticos a cada 8h, reavaliar hemograma em 12h.",
    },
  ],
  internacoes: [
    {
      id: "int-seed-1",
      pacienteId: "int-seed-1",
      pacienteNome: "Thor",
      especie: "Canino",
      raca: "Golden Retriever",
      leito: "01",
      responsavel: "Dra. Mariana Lima",
      tutorNome: "João Silva",
      tutorTelefone: "(91) 99102 4411",
      diagnostico: "Parvovirose",
      observacoes: "Jejum hídrico até 12h. Alergia a penicilina.",
      status: "critico",
      criadoEm: minutosAtras(60 * 24 * 4),
    },
    {
      id: "int-seed-2",
      pacienteId: "int-seed-2",
      pacienteNome: "Luna",
      especie: "Felino",
      raca: "SRD",
      leito: "03",
      responsavel: "Dr. Ricardo Silva",
      tutorNome: "Carla Dias",
      tutorTelefone: "(91) 98231 7720",
      diagnostico: "Lipidose hepática",
      status: "internado",
      criadoEm: minutosAtras(60 * 24 * 2),
    },
  ],
  adicionarInternacao: (r) => {
    const reg: Internacao = {
      ...r,
      id: `int-${Date.now().toString(36)}`,
      status: r.status ?? "internado",
      criadoEm: new Date().toISOString(),
    };
    set((s) => ({ internacoes: [reg, ...s.internacoes] }));
    return reg;
  },
  alterarStatusInternacao: (id, status) =>
    set((s) => ({
      internacoes: s.internacoes.map((i) =>
        i.id === id
          ? { ...i, status, altaEm: status === "alta" || status === "obito" ? new Date().toISOString() : i.altaEm }
          : i,
      ),
    })),

  salvarAnamnese: (r) => {
    const reg = novoRegistro(r);
    set((s) => ({ anamneses: [reg, ...s.anamneses] }));
    return reg;
  },
  salvarExameFisico: (r) => {
    const reg = novoRegistro(r);
    set((s) => ({ examesFisicos: [reg, ...s.examesFisicos] }));
    return reg;
  },
  salvarDiagnostico: (r) => {
    const reg = novoRegistro(r);
    set((s) => ({ diagnosticos: [reg, ...s.diagnosticos] }));
    return reg;
  },
  salvarPrescricao: (r) => {
    const reg = novoRegistro(r);
    set((s) => ({ prescricoes: [reg, ...s.prescricoes] }));
    return reg;
  },
  salvarEvolucaoSOAP: (r) => {
    const reg = novoRegistro(r);
    set((s) => ({ evolucoesSOAP: [reg, ...s.evolucoesSOAP] }));
    return reg;
  },
});

// =================================================================
// ROOT STORE
// =================================================================
export const useStore = create<RootState>()((...a) => ({
  ...createTutorSlice(...a),
  ...createTriagemSlice(...a),
  ...createProntuarioSlice(...a),
}));

// =================================================================
// COMPATIBILIDADE COM A API ANTIGA (Provider + hook agregador)
// Mantém todos os componentes existentes funcionando sem alterações.
// =================================================================
export function VitalisStoreProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useVitalisStore(): RootState {
  return useStore((s) => s);
}
