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
      endereco: "Av. Governador José Malcher, 1200, Nazaré, Belém, PA",
      lat: -1.4498,
      lng: -48.4751,
      servicos: ["Consulta", "Vacinação", "Castração", "Triagem"],
      atendimento24h: false,
      telefone: "(91) 3000 0001",
    },
    {
      id: "hospital-veterinario",
      nome: "Hospital Veterinário Municipal de Belém",
      tipo: "hospital",
      endereco: "Av. Almirante Barroso, 4500, Souza, Belém, PA",
      lat: -1.4042,
      lng: -48.4537,
      servicos: ["Urgência", "Internação", "Cirurgia", "Imagem", "Laboratório"],
      atendimento24h: true,
      telefone: "(91) 3000 0002",
    },
    {
      id: "movel-icoaraci",
      nome: "Unidade Móvel Icoaraci",
      tipo: "movel",
      endereco: "Praça São Sebastião, Icoaraci, Belém, PA",
      lat: -1.2884,
      lng: -48.4783,
      servicos: ["Triagem", "Vacinação", "Vermifugação"],
      atendimento24h: false,
    },
    {
      id: "movel-mosqueiro",
      nome: "Unidade Móvel Mosqueiro",
      tipo: "movel",
      endereco: "Av. Beira-Mar, Mosqueiro, Belém, PA",
      lat: -1.0856,
      lng: -48.4128,
      servicos: ["Triagem", "Vacinação"],
      atendimento24h: false,
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
