import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { calcularMotor, gerarProtocolo, gerarProtocoloAgendamento } from "@/lib/triagem";
import type { Triagem, ValidacaoDecisao, EtapasTriagem, Agendamento, StatusAgendamento } from "@/data/types";
import { veterinarios } from "@/data/veterinarios";
import { nomeEspecialidade } from "@/config/municipio";

// Seed inicial: 6 triagens variadas, sendo a primeira com red-flag ativo.
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

// Seed de agendamentos para hoje e amanhã, distribuídos entre os veterinários.
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

export type Papel = "tutor" | "recepcao" | "veterinario" | "gestor";

interface StoreCtx {
  triagens: Triagem[];
  decisoes: ValidacaoDecisao[];
  adicionarTriagem: (parcial: Omit<Triagem, "id" | "protocolo" | "criadoEm" | "status">) => Triagem;
  decidir: (d: ValidacaoDecisao) => void;
  papel: Papel;
  setPapel: (p: Papel) => void;
  rascunho: EtapasTriagem & { animal?: Triagem["animal"]; tutor?: Triagem["tutor"] };
  setRascunho: (r: StoreCtx["rascunho"]) => void;
  resetRascunho: () => void;
  ultimaTriagemId?: string;
  setUltimaTriagemId: (id?: string) => void;
  agendamentos: Agendamento[];
  criarAgendamento: (
    parcial: Omit<Agendamento, "id" | "protocolo" | "criadoEm">,
  ) => Agendamento;
  atualizarStatusAgendamento: (id: string, status: StatusAgendamento) => void;
  removerAgendamento: (id: string) => void;
  ultimoAgendamentoId?: string;
  setUltimoAgendamentoId: (id?: string) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

let seq = 100;

export function VitalisStoreProvider({ children }: { children: ReactNode }) {
  const [triagens, setTriagens] = useState<Triagem[]>(seedTriagens);
  const [decisoes, setDecisoes] = useState<ValidacaoDecisao[]>([]);
  const [papel, setPapel] = useState<Papel>("tutor");
  const [rascunho, setRascunho] = useState<StoreCtx["rascunho"]>({ sintomas: [] });
  const [ultimaTriagemId, setUltimaTriagemId] = useState<string | undefined>();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(seedAgs);
  const [ultimoAgendamentoId, setUltimoAgendamentoId] = useState<string | undefined>();

  const value = useMemo<StoreCtx>(
    () => ({
      triagens,
      decisoes,
      adicionarTriagem: (parcial) => {
        const t: Triagem = {
          ...parcial,
          id: `t-${(++seq).toString().padStart(3, "0")}`,
          protocolo: gerarProtocolo(seq),
          criadoEm: new Date().toISOString(),
          status: parcial.redFlags.length > 0 ? "urgencia" : "pendente",
        };
        setTriagens((arr) => [t, ...arr]);
        return t;
      },
      decidir: (d) => {
        setDecisoes((arr) => [...arr, d]);
        setTriagens((arr) =>
          arr.map((t) =>
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
        );
      },
      papel,
      setPapel,
      rascunho,
      setRascunho,
      resetRascunho: () => setRascunho({ sintomas: [] }),
      ultimaTriagemId,
      setUltimaTriagemId,
      agendamentos,
      criarAgendamento: (parcial) => {
        const a: Agendamento = {
          ...parcial,
          id: `ag-${Date.now().toString(36)}`,
          protocolo: gerarProtocoloAgendamento(),
          criadoEm: new Date().toISOString(),
        };
        setAgendamentos((arr) => [a, ...arr]);
        return a;
      },
      ultimoAgendamentoId,
      setUltimoAgendamentoId,
    }),
    [triagens, decisoes, papel, rascunho, ultimaTriagemId, agendamentos, ultimoAgendamentoId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVitalisStore(): StoreCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useVitalisStore requer VitalisStoreProvider");
  return v;
}
