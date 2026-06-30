import type { EspecialidadeId } from "@/config/municipio";

export interface Veterinario {
  id: string;
  iniciais: string;
  nome: string;
  especialidadeId: EspecialidadeId;
  unidadeId: string;
  cor: string; // tailwind color name
}

export const veterinarios: Veterinario[] = [
  { id: "vet-rs", iniciais: "RS", nome: "Dr. Ricardo Silva", especialidadeId: "clinico-geral", unidadeId: "clinica-centro", cor: "blue" },
  { id: "vet-am", iniciais: "AM", nome: "Dra. Ana Mendes", especialidadeId: "cardiologia", unidadeId: "hospital-veterinario", cor: "indigo" },
  { id: "vet-ms", iniciais: "MS", nome: "Dr. Marcos Souza", especialidadeId: "ortopedia", unidadeId: "hospital-veterinario", cor: "amber" },
  { id: "vet-cl", iniciais: "CL", nome: "Dr. Carlos Lima", especialidadeId: "dermatologia", unidadeId: "clinica-centro", cor: "emerald" },
  { id: "vet-jp", iniciais: "JP", nome: "Dra. Juliana Pires", especialidadeId: "nefrologia", unidadeId: "hospital-veterinario", cor: "rose" },
];
