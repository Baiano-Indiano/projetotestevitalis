// Configuração do município. Toda lista de especialidade, unidade e
// limite de capacidade é lida daqui. Trocar este arquivo licencia
// o Vitalis para outra prefeitura sem alterar layout.

export type EspecialidadeId =
  | "clinico-geral"
  | "traumatologia"
  | "cardiologia"
  | "nefrologia"
  | "oncologia"
  | "endocrinologia"
  | "ortopedia"
  | "dermatologia";

export interface EspecialidadeConfig {
  id: EspecialidadeId;
  nome: string;
  ativa: boolean;
}

export interface UnidadeConfig {
  id: string;
  nome: string;
  tipo: "clinica" | "hospital" | "movel";
  endereco: string;
  lat: number;
  lng: number;
  servicos: string[];
  atendimento24h: boolean;
  telefone?: string;
}

export interface MunicipioConfig {
  nomeRede: string;
  cidade: string;
  uf: string;
  prefeitura: string;
  especialidades: EspecialidadeConfig[];
  unidades: UnidadeConfig[];
  capacidade: {
    triagensPorDia: number;
    consultasPorDia: number;
  };
}

export const municipio: MunicipioConfig = {
  nomeRede: "Vitalis Belém",
  cidade: "Belém",
  uf: "PA",
  prefeitura: "Prefeitura Municipal de Belém",
  especialidades: [
    { id: "clinico-geral", nome: "Clínico Geral", ativa: true },
    { id: "traumatologia", nome: "Traumatologia", ativa: true },
    { id: "cardiologia", nome: "Cardiologia", ativa: true },
    { id: "nefrologia", nome: "Nefrologia", ativa: true },
    { id: "oncologia", nome: "Oncologia", ativa: true },
    { id: "endocrinologia", nome: "Endocrinologia", ativa: true },
    { id: "ortopedia", nome: "Ortopedia", ativa: true },
    { id: "dermatologia", nome: "Dermatologia", ativa: true },
  ],
  unidades: [
    {
      id: "clinica-centro",
      nome: "Clínica Veterinária Municipal Centro",
      tipo: "clinica",
      endereco: "Av. Marques de Herval, Belém, PA",
      lat: -1.4498,
      lng: -48.4751,
      servicos: ["Consulta", "Vacinação", "Castração", "Triagem"],
      atendimento24h: false,
      telefone: "(91) 3000 0001",
    },
    {
      id: "hospital-veterinario",
      nome: "Hospital Municipal Veterinário",
      tipo: "hospital",
      endereco: "Av. José Bonifácio, 578 - Fátima, Belém - PA, Brasil",
      lat: -1.4486,
      lng: -48.4689,
      servicos: ["Urgência", "Internação", "Cirurgia", "Imagem", "Laboratório"],
      atendimento24h: false,
      telefone: "(91) 3000 0002",
    },
  ],
  capacidade: {
    triagensPorDia: 320,
    consultasPorDia: 180,
  },
};

export const especialidadesAtivas = () =>
  municipio.especialidades.filter((e) => e.ativa);

export const unidade24h = () =>
  municipio.unidades.find((u) => u.atendimento24h) ?? municipio.unidades[0];

export const nomeEspecialidade = (id: EspecialidadeId): string =>
  municipio.especialidades.find((e) => e.id === id)?.nome ?? id;

