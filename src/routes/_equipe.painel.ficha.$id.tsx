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
import { ArrowLeft, FileText, Sparkles, Save } from "lucide-react";
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

        <TabsContent value="exame" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Exame físico</CardTitle>
            </CardHeader>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Módulo em construção — parâmetros vitais, inspeção e palpação.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="diagnostico" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Diagnóstico</CardTitle>
            </CardHeader>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Módulo em construção — hipóteses, CID-Vet e exames complementares.
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
