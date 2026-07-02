import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useVitalisStore } from "@/data/store";
import { categoriasParte1, categoriasParte2 } from "@/data/sintomas-categorias";
import { sintomaPorId } from "@/data/sintomas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Save,
  Check,
  Stethoscope,
  TestTube,
  Pill,
  Plus,
  Trash2,
  Printer,
  ClipboardList,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import { SolicitacaoExames } from "@/components/SolicitacaoExames";

export const Route = createFileRoute("/_equipe/painel/ficha/$id")({
  head: () => ({ meta: [{ title: "Ficha clínica. Vitalis" }] }),
  component: FichaPage,
});

const todasCategorias = [...categoriasParte1, ...categoriasParte2];

function labelSintoma(id: string): string {
  for (const cat of todasCategorias) {
    const item = cat.itens.find((i) => i.id === id);
    if (item) return item.label;
  }
  return sintomaPorId(id)?.nome ?? id;
}

function FichaPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { triagens, salvarDiagnostico: persistirDiagnostico } = useVitalisStore();
  const triagem = useMemo(() => triagens.find((t) => t.id === id), [triagens, id]);
  const triagensDisponiveis = useMemo(
    () => [...triagens].sort((a, b) => (b.criadoEm ?? "").localeCompare(a.criadoEm ?? "")),
    [triagens],
  );


  // Pré-preenchimento da anamnese a partir da triagem
  const sintomasTexto = useMemo(() => {
    if (!triagem) return "";
    return triagem.etapas.sintomas.map(labelSintoma).join(", ");
  }, [triagem]);

  const queixaInicial = triagem?.etapas.observacoes ?? "";
  const inicioSintomas = triagem?.etapas.tempo?.inicio ?? "";
  const duracao = triagem?.etapas.tempo?.duracao ?? "";

  const [anamnese, setAnamnese] = useState({
    queixa: queixaInicial,
    inicio: inicioSintomas,
    duracao: duracao,
    sintomas: sintomasTexto,
    historico: "",
    vacinas: triagem?.etapas.ambiente?.vacinado ? "Em dia conforme triagem" : "",
    ambiente:
      triagem?.etapas.ambiente?.ambiente === "rua"
        ? "Acesso à rua"
        : triagem?.etapas.ambiente?.ambiente === "misto"
          ? "Acesso misto (casa e rua)"
          : triagem?.etapas.ambiente?.ambiente === "domestico"
            ? "Estritamente domiciliar"
            : "",
    alimentacao: "",
    medicamentos: "",
    alergias: "",
  });

  const [exameFisico, setExameFisico] = useState({
    temperatura: "",
    fc: "",
    fr: "",
    tpc: "",
    hidratacao: "",
    mucosas: "",
    escoreCorporal: "",
    linfonodos: "",
    sistemaCardio: "",
    sistemaResp: "",
    sistemaDigest: "",
    sistemaLocomotor: "",
    sistemaNeuro: "",
    observacoesGerais: "",
  });

  const salvarExame = () => {
    toast.success("Exame físico salvo no prontuário", {
      description: triagem ? `Protocolo ${triagem.protocolo}` : undefined,
    });
  };

  const [diagnostico, setDiagnostico] = useState<{
    suspeitaPrincipal: string;
    cidVet: string;
    justificativa: string;
    examesSolicitados: string[];
    observacoesExame: string;
  }>({
    suspeitaPrincipal: "",
    cidVet: "",
    justificativa: "",
    examesSolicitados: [],
    observacoesExame: "",
  });

  const toggleExame = (id: string) => {
    setDiagnostico((prev) => ({
      ...prev,
      examesSolicitados: prev.examesSolicitados.includes(id)
        ? prev.examesSolicitados.filter((e) => e !== id)
        : [...prev.examesSolicitados, id],
    }));
  };

  const salvarDiagnostico = () => {
    if (diagnostico.examesSolicitados.length === 0 && !diagnostico.suspeitaPrincipal) {
      toast.error("Preencha ao menos a suspeita ou solicite exames");
      return;
    }
    persistirDiagnostico({
      pacienteId: triagem?.id ?? id,
      conteudo: {
        ...diagnostico,
        pacienteNome: triagem?.animal.nome ?? "Paciente",
        especie: triagem?.animal.especie ?? "",
        raca: triagem?.animal.raca ?? "",
        tutorNome: triagem?.tutor.nome ?? "",
        protocolo: triagem?.protocolo,
        solicitanteNome: "Dra. Amanda Souza",
      },
    });
    toast.success("Diagnóstico salvo no prontuário", {
      description: triagem ? `Protocolo ${triagem.protocolo}` : undefined,
    });
  };


  type ItemPrescricao = {
    id: string;
    medicamento: string;
    dosagem: string;
    via: string;
    frequencia: string;
    duracao: string;
    farmaciaMunicipal: boolean;
  };
  const [listaPrescricao, setListaPrescricao] = useState<ItemPrescricao[]>([]);
  const [tempMedicamento, setTempMedicamento] = useState("");
  const [tempDosagem, setTempDosagem] = useState("");
  const [tempVia, setTempVia] = useState("");
  const [tempFrequencia, setTempFrequencia] = useState("");
  const [tempDuracao, setTempDuracao] = useState("");
  const [tempFarmaciaMunicipal, setTempFarmaciaMunicipal] = useState(true);
  const [recomendacoes, setRecomendacoes] = useState("");

  // Encaminhamento externo
  const [encaminhamento, setEncaminhamento] = useState({ especialidade: "", motivo: "" });
  const gerarGuiaEncaminhamento = () => {
    if (!encaminhamento.especialidade) {
      toast.error("Selecione a especialidade de destino");
      return;
    }
    toast.success("Guia de Referência Externa gerada", {
      description: `Encaminhado para ${encaminhamento.especialidade}. Documento pronto para impressão.`,
    });
  };


  // Evolução clínica (SOAP)
  const [novaEvolucao, setNovaEvolucao] = useState({
    subjetivo: "",
    objetivo: "",
    avaliacao: "",
    plano: "",
  });
  const [historicoEvolucoes, setHistoricoEvolucoes] = useState<
    Array<{
      id: string;
      dataHora: string;
      medico: string;
      subjetivo: string;
      objetivo: string;
      avaliacao: string;
      plano: string;
    }>
  >([
    {
      id: "ev-mock-1",
      dataHora: "Ontem, 14:30",
      medico: "Dr. João Silva",
      subjetivo:
        "Tutor relata que o animal apresentou episódio de vômito noturno e diminuição do apetite nas últimas 24h.",
      objetivo:
        "FC 120bpm, FR 28rpm, T 39,1°C, mucosas levemente pálidas, TPC 2s, abdome sensível à palpação em região epigástrica.",
      avaliacao:
        "Quadro compatível com gastrite aguda. Sem sinais de desidratação severa no momento.",
      plano:
        "Manter jejum hídrico por 6h, iniciar protetor gástrico (omeprazol) e antiemético. Reavaliar em 24h.",
    },
  ]);

  const salvarEvolucao = () => {
    if (
      !novaEvolucao.subjetivo.trim() &&
      !novaEvolucao.objetivo.trim() &&
      !novaEvolucao.avaliacao.trim() &&
      !novaEvolucao.plano.trim()
    ) {
      toast.error("Preencha ao menos um campo antes de salvar.");
      return;
    }
    const agora = new Date();
    const dataHora = `Hoje, ${agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    setHistoricoEvolucoes((prev) => [
      {
        id: crypto.randomUUID(),
        dataHora,
        medico: "Dra. Ana Souza",
        ...novaEvolucao,
      },
      ...prev,
    ]);
    setNovaEvolucao({ subjetivo: "", objetivo: "", avaliacao: "", plano: "" });
    toast.success("Evolução clínica registrada");
  };

  const adicionarMedicamento = () => {
    if (!tempMedicamento.trim()) {
      toast.error("Informe ao menos o nome do medicamento");
      return;
    }
    setListaPrescricao((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        medicamento: tempMedicamento,
        dosagem: tempDosagem,
        via: tempVia,
        frequencia: tempFrequencia,
        duracao: tempDuracao,
        farmaciaMunicipal: tempFarmaciaMunicipal,
      },
    ]);
    setTempMedicamento("");
    setTempDosagem("");
    setTempVia("");
    setTempFrequencia("");
    setTempDuracao("");
    setTempFarmaciaMunicipal(true);

  };

  const removerMedicamento = (id: string) => {
    setListaPrescricao((prev) => prev.filter((m) => m.id !== id));
  };

  const salvarPrescricao = () => {
    toast.success("Prescrição salva no prontuário", {
      description: triagem ? `Protocolo ${triagem.protocolo}` : undefined,
    });
  };

  const salvar = () => {
    toast.success("Anamnese salva no prontuário", {
      description: triagem ? `Protocolo ${triagem.protocolo}` : undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            to="/painel"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao painel
          </Link>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Ficha clínica
          </h1>
          <p className="text-sm text-muted-foreground">
            Prontuário único do animal — anamnese, exame, diagnóstico, prescrição e evolução.
          </p>
        </div>
        <Button onClick={salvar} className="gap-2">
          <Save className="h-4 w-4" /> Salvar prontuário
        </Button>
      </div>

      {/* Vincular paciente quando ficha ainda não tem triagem */}
      {!triagem && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Nenhum animal vinculado a esta ficha</p>
              <p className="text-xs text-muted-foreground">
                Selecione um paciente com triagem já registrada ou faça um novo cadastro presencial.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Select
                onValueChange={(v) => navigate({ to: "/painel/ficha/$id", params: { id: v } })}
              >
                <SelectTrigger className="w-full md:w-[320px]">
                  <SelectValue placeholder="Vincular paciente por triagem…" />
                </SelectTrigger>
                <SelectContent>
                  {triagensDisponiveis.length === 0 && (
                    <div className="px-2 py-3 text-sm text-muted-foreground">
                      Nenhuma triagem disponível
                    </div>
                  )}
                  {triagensDisponiveis.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.protocolo} — {t.animal.nome || "Sem nome"} ({t.tutor.nome || "tutor"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" asChild>
                <Link to="/painel/novo-cadastro">Novo cadastro presencial</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cabeçalho do paciente */}
      <Card>
        <CardContent className="grid gap-4 py-5 md:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Paciente</p>
            <p className="font-medium">{triagem?.animal.nome ?? "Animal não vinculado"}</p>
            {triagem && (
              <p className="text-sm text-muted-foreground">
                {triagem.animal.especie === "cao" ? "Cão" : triagem.animal.especie === "gato" ? "Gato" : "Outro"} •{" "}
                {triagem.animal.raca} • {triagem.animal.sexo === "macho" ? "Macho" : "Fêmea"} • {triagem.animal.idade}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Tutor</p>
            <p className="font-medium">{triagem?.tutor.nome ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{triagem?.tutor.telefone ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Protocolo</p>
            <p className="font-mono text-sm">{triagem?.protocolo ?? id}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Prioridade</p>
            <Badge
              variant={
                triagem?.prioridade === "alta"
                  ? "destructive"
                  : triagem?.prioridade === "media"
                    ? "secondary"
                    : "outline"
              }
              className="mt-1"
            >
              {triagem?.prioridade ?? "—"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="anamnese" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="anamnese">Anamnese</TabsTrigger>
          <TabsTrigger value="exame">Exame físico</TabsTrigger>
          <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
          <TabsTrigger value="prescricao">Prescrição</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
          <TabsTrigger value="encaminhar">Encaminhar</TabsTrigger>
        </TabsList>


        {/* ANAMNESE */}
        <TabsContent value="anamnese" className="mt-6 space-y-6">
          {triagem && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Pré-preenchido pela triagem online
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Os campos abaixo foram populados a partir do protocolo{" "}
                  <span className="font-mono">{triagem.protocolo}</span>. Revise, complemente e salve.
                </p>
                {triagem.redFlags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs font-medium text-destructive">Red flags:</span>
                    {triagem.redFlags.map((rf) => (
                      <Badge key={rf} variant="destructive" className="text-xs">
                        {labelSintoma(rf)}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" /> Anamnese
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="queixa">Queixa principal</Label>
                <Textarea
                  id="queixa"
                  value={anamnese.queixa}
                  onChange={(e) => setAnamnese({ ...anamnese, queixa: e.target.value })}
                  rows={3}
                  placeholder="Motivo da consulta relatado pelo tutor"
                />
              </div>

              <div>
                <Label htmlFor="inicio">Início dos sintomas</Label>
                <Input
                  id="inicio"
                  value={anamnese.inicio}
                  onChange={(e) => setAnamnese({ ...anamnese, inicio: e.target.value })}
                  placeholder="ex.: há 2 dias"
                />
              </div>
              <div>
                <Label htmlFor="duracao">Duração / evolução</Label>
                <Input
                  id="duracao"
                  value={anamnese.duracao}
                  onChange={(e) => setAnamnese({ ...anamnese, duracao: e.target.value })}
                  placeholder="ex.: agudo, progressivo"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="sintomas">Sintomas relatados</Label>
                <Textarea
                  id="sintomas"
                  value={anamnese.sintomas}
                  onChange={(e) => setAnamnese({ ...anamnese, sintomas: e.target.value })}
                  rows={2}
                />
              </div>

              <Separator className="md:col-span-2" />

              <div>
                <Label htmlFor="vacinas">Vacinação e vermifugação</Label>
                <Input
                  id="vacinas"
                  value={anamnese.vacinas}
                  onChange={(e) => setAnamnese({ ...anamnese, vacinas: e.target.value })}
                  placeholder="Status e datas"
                />
              </div>
              <div>
                <Label htmlFor="ambiente">Ambiente / convívio</Label>
                <Input
                  id="ambiente"
                  value={anamnese.ambiente}
                  onChange={(e) => setAnamnese({ ...anamnese, ambiente: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="alimentacao">Alimentação</Label>
                <Input
                  id="alimentacao"
                  value={anamnese.alimentacao}
                  onChange={(e) => setAnamnese({ ...anamnese, alimentacao: e.target.value })}
                  placeholder="Ração, frequência, água"
                />
              </div>
              <div>
                <Label htmlFor="medicamentos">Medicamentos em uso</Label>
                <Input
                  id="medicamentos"
                  value={anamnese.medicamentos}
                  onChange={(e) => setAnamnese({ ...anamnese, medicamentos: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="alergias">Alergias e antecedentes</Label>
                <Textarea
                  id="alergias"
                  value={anamnese.alergias}
                  onChange={(e) => setAnamnese({ ...anamnese, alergias: e.target.value })}
                  rows={2}
                  placeholder="Alergias conhecidas, cirurgias, doenças prévias"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="historico">Histórico adicional</Label>
                <Textarea
                  id="historico"
                  value={anamnese.historico}
                  onChange={(e) => setAnamnese({ ...anamnese, historico: e.target.value })}
                  rows={3}
                  placeholder="Outras observações clinicamente relevantes"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exame" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Stethoscope className="h-4 w-4" /> Parâmetros vitais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-3">
              <div>
                <Label htmlFor="temperatura">Temperatura (°C)</Label>
                <Input
                  id="temperatura"
                  type="number"
                  step="0.1"
                  value={exameFisico.temperatura}
                  onChange={(e) => setExameFisico({ ...exameFisico, temperatura: e.target.value })}
                  placeholder="ex.: 38,5"
                />
              </div>
              <div>
                <Label htmlFor="fc">Frequência cardíaca (bpm)</Label>
                <Input
                  id="fc"
                  type="number"
                  value={exameFisico.fc}
                  onChange={(e) => setExameFisico({ ...exameFisico, fc: e.target.value })}
                  placeholder="ex.: 120"
                />
              </div>
              <div>
                <Label htmlFor="fr">Frequência respiratória (mpm)</Label>
                <Input
                  id="fr"
                  type="number"
                  value={exameFisico.fr}
                  onChange={(e) => setExameFisico({ ...exameFisico, fr: e.target.value })}
                  placeholder="ex.: 24"
                />
              </div>
              <div>
                <Label htmlFor="tpc">TPC (segundos)</Label>
                <Input
                  id="tpc"
                  type="number"
                  step="0.1"
                  value={exameFisico.tpc}
                  onChange={(e) => setExameFisico({ ...exameFisico, tpc: e.target.value })}
                  placeholder="ex.: 2"
                />
              </div>
              <div>
                <Label htmlFor="mucosas">Mucosas</Label>
                <Select
                  value={exameFisico.mucosas}
                  onValueChange={(v) => setExameFisico({ ...exameFisico, mucosas: v })}
                >
                  <SelectTrigger id="mucosas">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normocoradas">Normocoradas</SelectItem>
                    <SelectItem value="palidas">Pálidas</SelectItem>
                    <SelectItem value="cianoticas">Cianóticas</SelectItem>
                    <SelectItem value="ictericas">Ictéricas</SelectItem>
                    <SelectItem value="hiperemicas">Hiperêmicas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="hidratacao">Nível de hidratação</Label>
                <Select
                  value={exameFisico.hidratacao}
                  onValueChange={(v) => setExameFisico({ ...exameFisico, hidratacao: v })}
                >
                  <SelectTrigger id="hidratacao">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="moderada">Moderada</SelectItem>
                    <SelectItem value="grave">Grave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="escoreCorporal">Escore corporal (1-9)</Label>
                <Select
                  value={exameFisico.escoreCorporal}
                  onValueChange={(v) => setExameFisico({ ...exameFisico, escoreCorporal: v })}
                >
                  <SelectTrigger id="escoreCorporal">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 9 }, (_, i) => String(i + 1)).map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" /> Inspeção e palpação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="linfonodos">Linfonodos</Label>
                  <Textarea
                    id="linfonodos"
                    rows={3}
                    value={exameFisico.linfonodos}
                    onChange={(e) => setExameFisico({ ...exameFisico, linfonodos: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="sistemaCardio">Sistema cardiovascular</Label>
                  <Textarea
                    id="sistemaCardio"
                    rows={3}
                    value={exameFisico.sistemaCardio}
                    onChange={(e) => setExameFisico({ ...exameFisico, sistemaCardio: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="sistemaResp">Sistema respiratório</Label>
                  <Textarea
                    id="sistemaResp"
                    rows={3}
                    value={exameFisico.sistemaResp}
                    onChange={(e) => setExameFisico({ ...exameFisico, sistemaResp: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="sistemaDigest">Sistema digestório / abdominal</Label>
                  <Textarea
                    id="sistemaDigest"
                    rows={3}
                    value={exameFisico.sistemaDigest}
                    onChange={(e) => setExameFisico({ ...exameFisico, sistemaDigest: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="sistemaLocomotor">Sistema locomotor / articular</Label>
                  <Textarea
                    id="sistemaLocomotor"
                    rows={3}
                    value={exameFisico.sistemaLocomotor}
                    onChange={(e) =>
                      setExameFisico({ ...exameFisico, sistemaLocomotor: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sistemaNeuro">Sistema neurológico</Label>
                  <Textarea
                    id="sistemaNeuro"
                    rows={3}
                    value={exameFisico.sistemaNeuro}
                    onChange={(e) => setExameFisico({ ...exameFisico, sistemaNeuro: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observacoesGerais">Observações gerais do exame físico</Label>
                <Textarea
                  id="observacoesGerais"
                  rows={4}
                  value={exameFisico.observacoesGerais}
                  onChange={(e) =>
                    setExameFisico({ ...exameFisico, observacoesGerais: e.target.value })
                  }
                  placeholder="Achados adicionais, impressão clínica geral"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={salvarExame} className="gap-2">
                  <Check className="h-4 w-4" /> Salvar exame físico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostico" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" /> Hipóteses diagnósticas
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="suspeita">Suspeita clínica principal</Label>
                <Input
                  id="suspeita"
                  value={diagnostico.suspeitaPrincipal}
                  onChange={(e) =>
                    setDiagnostico({ ...diagnostico, suspeitaPrincipal: e.target.value })
                  }
                  placeholder="ex.: Gastrenterite hemorrágica aguda"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="cidvet">Categoria da doença / CID-Vet</Label>
                <Select
                  value={diagnostico.cidVet}
                  onValueChange={(v) => setDiagnostico({ ...diagnostico, cidVet: v })}
                >
                  <SelectTrigger id="cidvet">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="infecciosa">Doença infecciosa</SelectItem>
                    <SelectItem value="metabolica">Doença metabólica e endócrina</SelectItem>
                    <SelectItem value="trauma">Trauma ou ortopédico</SelectItem>
                    <SelectItem value="neoplasia">Neoplasia</SelectItem>
                    <SelectItem value="neurologica">Doença neurológica</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="justificativa">Justificativa e raciocínio clínico</Label>
                <Textarea
                  id="justificativa"
                  rows={5}
                  value={diagnostico.justificativa}
                  onChange={(e) =>
                    setDiagnostico({ ...diagnostico, justificativa: e.target.value })
                  }
                  placeholder="Achados que sustentam a hipótese, diagnósticos diferenciais e plano"
                />
              </div>
            </CardContent>
          </Card>

          <SolicitacaoExames
            selecionados={diagnostico.examesSolicitados}
            onToggle={toggleExame}
            onSetSelecionados={(ids) =>
              setDiagnostico({ ...diagnostico, examesSolicitados: ids })
            }
            observacoes={diagnostico.observacoesExame}
            onObsChange={(v) => setDiagnostico({ ...diagnostico, observacoesExame: v })}
            onSalvar={salvarDiagnostico}
          />
        </TabsContent>
        <TabsContent value="prescricao" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Pill className="h-4 w-4" /> Receituário médico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-4">
                  <Label htmlFor="med">Nome do medicamento</Label>
                  <Input
                    id="med"
                    value={tempMedicamento}
                    onChange={(e) => setTempMedicamento(e.target.value)}
                    placeholder="ex.: Meloxicam 0,5 mg"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="dose">Dosagem</Label>
                  <Input
                    id="dose"
                    value={tempDosagem}
                    onChange={(e) => setTempDosagem(e.target.value)}
                    placeholder="ex.: 1 cp"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="via">Via</Label>
                  <Select value={tempVia} onValueChange={setTempVia}>
                    <SelectTrigger id="via">
                      <SelectValue placeholder="Via" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oral">Oral</SelectItem>
                      <SelectItem value="iv">Intravenosa</SelectItem>
                      <SelectItem value="sc">Subcutânea</SelectItem>
                      <SelectItem value="im">Intramuscular</SelectItem>
                      <SelectItem value="topica">Tópica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="freq">Frequência</Label>
                  <Select value={tempFrequencia} onValueChange={setTempFrequencia}>
                    <SelectTrigger id="freq">
                      <SelectValue placeholder="Frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8h">A cada 8 horas</SelectItem>
                      <SelectItem value="12h">A cada 12 horas</SelectItem>
                      <SelectItem value="24h">A cada 24 horas</SelectItem>
                      <SelectItem value="unica">Dose única</SelectItem>
                      <SelectItem value="continuo">Uso contínuo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="dur">Duração</Label>
                  <Input
                    id="dur"
                    value={tempDuracao}
                    onChange={(e) => setTempDuracao(e.target.value)}
                    placeholder="ex.: 5 dias"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={adicionarMedicamento} className="gap-2">
                  <Plus className="h-4 w-4" /> Adicionar à receita
                </Button>
              </div>

              <Separator />

              {listaPrescricao.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum medicamento prescrito ainda
                </p>
              ) : (
                <ul className="space-y-2">
                  {listaPrescricao.map((m, i) => (
                    <li
                      key={m.id}
                      className="flex items-start justify-between gap-3 rounded-sm border border-border bg-card px-4 py-3"
                    >
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold">
                          {i + 1}. {m.medicamento}
                        </p>
                        <p className="text-muted-foreground">
                          {[
                            m.via && `Via: ${m.via}`,
                            m.dosagem && `Dosagem: ${m.dosagem}`,
                            m.frequencia && `Frequência: ${m.frequencia}`,
                            m.duracao && `Duração: ${m.duracao}`,
                          ]
                            .filter(Boolean)
                            .join(" • ")}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removerMedicamento(m.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              <div>
                <Label htmlFor="recomendacoes">
                  Recomendações e instruções adicionais para o tutor
                </Label>
                <Textarea
                  id="recomendacoes"
                  rows={4}
                  value={recomendacoes}
                  onChange={(e) => setRecomendacoes(e.target.value)}
                  placeholder="Cuidados, sinais de alerta, retorno"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" /> Imprimir receita
                </Button>
                <Button onClick={salvarPrescricao} className="gap-2">
                  <Check className="h-4 w-4" /> Salvar prescrição
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="evolucao" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="h-4 w-4 text-primary" />
                Nova Evolução Clínica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="soap-s">
                    <span className="font-semibold">Queixa</span>
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      Relato de comportamento, queixas e estado percebido do paciente.
                    </span>
                  </Label>
                  <Textarea
                    id="soap-s"
                    rows={5}
                    value={novaEvolucao.subjetivo}
                    onChange={(e) =>
                      setNovaEvolucao((p) => ({ ...p, subjetivo: e.target.value }))
                    }
                    placeholder="Ex.: Tutor relata melhora do apetite e disposição..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soap-o">
                    <span className="font-semibold">Parâmetros</span>
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      Parâmetros clínicos aferidos e achados de exames.
                    </span>
                  </Label>
                  <Textarea
                    id="soap-o"
                    rows={5}
                    value={novaEvolucao.objetivo}
                    onChange={(e) =>
                      setNovaEvolucao((p) => ({ ...p, objetivo: e.target.value }))
                    }
                    placeholder="Ex.: FC 110bpm, T 38,7°C, mucosas rosadas, TPC 2s..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soap-a">
                    <span className="font-semibold">Avaliação</span>
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      Análise clínica e conclusão médica sobre o quadro atual.
                    </span>
                  </Label>
                  <Textarea
                    id="soap-a"
                    rows={5}
                    value={novaEvolucao.avaliacao}
                    onChange={(e) =>
                      setNovaEvolucao((p) => ({ ...p, avaliacao: e.target.value }))
                    }
                    placeholder="Ex.: Evolução clínica favorável, resposta adequada ao tratamento..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soap-p">
                    <span className="font-semibold">Conduta Clínica / Tratamento</span>
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      Procedimentos, nova conduta terapêutica e recomendações.
                    </span>
                  </Label>
                  <Textarea
                    id="soap-p"
                    rows={5}
                    value={novaEvolucao.plano}
                    onChange={(e) =>
                      setNovaEvolucao((p) => ({ ...p, plano: e.target.value }))
                    }
                    placeholder="Ex.: Manter prescrição, reavaliar em 48h, liberar alimentação branda..."
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={salvarEvolucao} className="gap-2">
                  <Check className="h-4 w-4" /> Salvar Evolução
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Histórico de Evoluções</CardTitle>
            </CardHeader>
            <CardContent>
              {historicoEvolucoes.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Nenhuma evolução registrada ainda.
                </p>
              ) : (
                <div className="space-y-6">
                  {historicoEvolucoes.map((ev, idx) => (
                    <div key={ev.id} className="space-y-3">
                      <div className="text-xs text-muted-foreground">
                        {ev.medico} — {ev.dataHora}
                      </div>
                      <div className="space-y-2 text-sm leading-relaxed text-foreground">
                        <p>
                          <span className="font-semibold">S:</span> {ev.subjetivo || "—"}
                        </p>
                        <p>
                          <span className="font-semibold">O:</span> {ev.objetivo || "—"}
                        </p>
                        <p>
                          <span className="font-semibold">A:</span> {ev.avaliacao || "—"}
                        </p>
                        <p>
                          <span className="font-semibold">P:</span> {ev.plano || "—"}
                        </p>
                      </div>
                      {idx < historicoEvolucoes.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
