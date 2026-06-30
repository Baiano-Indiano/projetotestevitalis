import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { toast } from "sonner";

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
  const { triagens } = useVitalisStore();
  const triagem = useMemo(() => triagens.find((t) => t.id === id), [triagens, id]);

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
    toast.success("Diagnóstico salvo no prontuário", {
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="anamnese">Anamnese</TabsTrigger>
          <TabsTrigger value="exame">Exame físico</TabsTrigger>
          <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
          <TabsTrigger value="prescricao">Prescrição</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TestTube className="h-4 w-4" /> Solicitação de exames complementares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-5">
                  {[
                    {
                      grupo: "Laboratório",
                      itens: [
                        { id: "hemograma", label: "Hemograma completo" },
                        { id: "renal", label: "Perfil renal" },
                        { id: "hepatico", label: "Perfil hepático" },
                        { id: "urinalise", label: "Urinálise" },
                        { id: "sorologias", label: "Sorologias rápidas" },
                      ],
                    },
                    {
                      grupo: "Imagem",
                      itens: [
                        { id: "raiox", label: "Radiografia (Raio-X)" },
                        { id: "usg", label: "Ultrassonografia abdominal" },
                        { id: "eco", label: "Ecocardiograma" },
                      ],
                    },
                  ].map((g) => (
                    <div key={g.grupo} className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {g.grupo}
                      </p>
                      <div className="space-y-2">
                        {g.itens.map((item) => (
                          <label
                            key={item.id}
                            className="flex cursor-pointer items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
                          >
                            <Checkbox
                              checked={diagnostico.examesSolicitados.includes(item.id)}
                              onCheckedChange={() => toggleExame(item.id)}
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="obsExames">Observações e diretrizes para o laboratório</Label>
                    <Textarea
                      id="obsExames"
                      rows={8}
                      value={diagnostico.observacoesExame}
                      onChange={(e) =>
                        setDiagnostico({ ...diagnostico, observacoesExame: e.target.value })
                      }
                      placeholder="Jejum, prioridade, coletas especiais, contato do solicitante"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" /> Gerar guia de solicitação
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={salvarDiagnostico} className="gap-2">
                  <Check className="h-4 w-4" /> Salvar diagnóstico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="prescricao" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prescrição</CardTitle>
            </CardHeader>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Módulo em construção — medicamentos, posologia e receituário.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="evolucao" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evolução (SOAP)</CardTitle>
            </CardHeader>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Módulo em construção — registros diários no padrão SOAP.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
