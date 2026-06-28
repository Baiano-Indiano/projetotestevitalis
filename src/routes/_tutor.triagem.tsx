import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useVitalisStore } from "@/data/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { sintomas, sistemasLabel, inferirSintomas, sintomaPorId } from "@/data/sintomas";
import { calcularMotor } from "@/lib/triagem";
import { unidade24h } from "@/config/municipio";
import { AlertTriangle, ArrowLeft, ArrowRight, MapPin, Sparkles, X } from "lucide-react";
import { RedFlagBanner } from "@/components/RedFlagBanner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tutor/triagem")({
  head: () => ({
    meta: [
      { title: "Triagem online. Vitalis Belém" },
      {
        name: "description",
        content:
          "Responda 6 etapas guiadas para receber orientação clínica do seu animal. Detecção de sinais de emergência incluída.",
      },
      { property: "og:title", content: "Triagem online. Vitalis Belém" },
      { property: "og:description", content: "Triagem gratuita em 6 etapas, com validação por veterinário." },
    ],
  }),
  component: Triagem,
});

const etapas = [
  { id: 1, titulo: "Sobre o animal e o tutor", subtitulo: "Para identificar o atendimento." },
  { id: 2, titulo: "Estado atual", subtitulo: "Como o animal está agora." },
  { id: 3, titulo: "Sintomas", subtitulo: "Selecione tudo que perceber." },
  { id: 4, titulo: "Aprofundando os sintomas", subtitulo: "Detalhe a intensidade." },
  { id: 5, titulo: "Tempo e ambiente", subtitulo: "Quando começou e onde vive." },
  { id: 6, titulo: "Observações", subtitulo: "Conte com suas palavras." },
];

function Triagem() {
  const navigate = useNavigate();
  const { adicionarTriagem, setUltimaTriagemId } = useVitalisStore();
  const [step, setStep] = useState(1);
  const [erro, setErro] = useState<string | null>(null);

  // estado local da triagem
  const [animal, setAnimal] = useState({
    nome: "",
    especie: "cao" as "cao" | "gato" | "outro",
    raca: "",
    sexo: "macho" as "macho" | "femea",
    idade: "",
  });
  const [tutor, setTutor] = useState({ nome: "", telefone: "", anonimo: false });
  const [estado, setEstado] = useState({
    consciencia: "alerta" as "alerta" | "apatico" | "deprimido" | "inconsciente",
    apetite: "normal" as "normal" | "reduzido" | "ausente",
    hidratacao: "normal" as "normal" | "leve" | "moderada" | "grave",
    comportamento: "normal" as "normal" | "agitado" | "isolado" | "agressivo",
  });
  const [sintomaSel, setSintomaSel] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
  const [intensidade, setIntensidade] = useState<Record<string, "leve" | "moderada" | "intensa">>({});
  const [tempo, setTempo] = useState({ inicio: "há 1 dia", duracao: "agudo" });
  const [ambiente, setAmbiente] = useState({
    ambiente: "domestico" as "domestico" | "rua" | "misto",
    contatoOutros: false,
    vacinado: true,
  });
  const [observacoes, setObservacoes] = useState("");
  const [chipsIA, setChipsIA] = useState<string[]>([]);

  const motor = useMemo(() => calcularMotor(sintomaSel), [sintomaSel]);
  const temRedFlag = motor.redFlags.length > 0;

  const grupos = useMemo(() => {
    const filtrados = busca
      ? sintomas.filter((s) => s.nome.toLowerCase().includes(busca.toLowerCase()))
      : sintomas;
    const out: Record<string, typeof sintomas> = {};
    for (const s of filtrados) {
      (out[s.sistema] ??= []).push(s);
    }
    return out;
  }, [busca]);

  const toggleSintoma = (id: string) => {
    setSintomaSel((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]));
  };

  const validar = (): string | null => {
    if (step === 1) {
      if (!animal.nome) return "Informe o nome do animal.";
      if (!animal.raca) return "Informe a raça.";
      if (!animal.idade) return "Informe a idade aproximada.";
      if (!tutor.anonimo && (!tutor.nome || !tutor.telefone)) {
        return "Informe nome e telefone do tutor, ou marque continuar sem cadastro.";
      }
    }
    if (step === 3 && sintomaSel.length === 0) return "Selecione ao menos um sintoma.";
    return null;
  };

  const avancar = () => {
    const e = validar();
    if (e) {
      setErro(e);
      return;
    }
    setErro(null);
    if (step < 6) setStep(step + 1);
    else finalizar();
  };
  const voltar = () => {
    setErro(null);
    if (step > 1) setStep(step - 1);
  };

  const interpretar = () => {
    const ids = inferirSintomas(observacoes);
    setChipsIA(ids);
  };
  const aceitarChip = (id: string) => {
    toggleSintoma(id);
    setChipsIA((arr) => arr.filter((x) => x !== id));
  };

  const finalizar = () => {
    const t = adicionarTriagem({
      animal,
      tutor: tutor.anonimo
        ? { nome: "Tutor anônimo", telefone: "—" }
        : { nome: tutor.nome, telefone: tutor.telefone },
      canal: "online",
      etapas: {
        estadoAtual: estado,
        sintomas: sintomaSel,
        tempo,
        ambiente,
        observacoes,
        chipsIA,
      },
      redFlags: motor.redFlags,
      scores: motor.scores,
      sugestao: motor.sugestao,
      prioridade: motor.prioridade,
    });
    setUltimaTriagemId(t.id);
    navigate({ to: "/triagem/resultado" });
  };

  return (
    <div className="container-app py-6 md:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-text-strong">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <span className="text-xs font-medium uppercase tracking-wide text-text-soft">
            Etapa {step} de 6
          </span>
        </div>
        <Progress value={(step / 6) * 100} className="h-1.5" />
        <div className="mt-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-text-strong md:text-3xl">
            {etapas[step - 1].titulo}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{etapas[step - 1].subtitulo}</p>
        </div>

        {temRedFlag && step >= 3 && (
          <div className="mt-6">
            <RedFlagBanner
              ids={motor.redFlags}
              acao={
                <>
                  <Button asChild variant="destructive">
                    <Link to="/emergencia">
                      <AlertTriangle className="mr-1 h-4 w-4" /> Buscar urgência agora
                    </Link>
                  </Button>
                  <p className="text-xs text-destructive-700">
                    Você pode continuar a triagem para registrar o caso. A unidade 24h mais próxima é{" "}
                    <strong>{unidade24h().nome}</strong>.
                  </p>
                </>
              }
            />
          </div>
        )}

        <Card className="mt-6 border-border bg-surface p-6">
          {step === 1 && (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nome do animal" required>
                <Input value={animal.nome} onChange={(e) => setAnimal({ ...animal, nome: e.target.value })} placeholder="Ex. Thor" />
              </Field>
              <Field label="Espécie" required>
                <Select value={animal.especie} onValueChange={(v) => setAnimal({ ...animal, especie: v as typeof animal.especie })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cao">Cão</SelectItem>
                    <SelectItem value="gato">Gato</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Raça" required>
                <Input value={animal.raca} onChange={(e) => setAnimal({ ...animal, raca: e.target.value })} placeholder="Ex. SRD" />
              </Field>
              <Field label="Idade aproximada" required>
                <Input value={animal.idade} onChange={(e) => setAnimal({ ...animal, idade: e.target.value })} placeholder="Ex. 5 anos" />
              </Field>
              <Field label="Sexo">
                <RadioGroup value={animal.sexo} onValueChange={(v) => setAnimal({ ...animal, sexo: v as typeof animal.sexo })} className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="macho" /> Macho</label>
                  <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="femea" /> Fêmea</label>
                </RadioGroup>
              </Field>
              <div className="md:col-span-2 mt-2 rounded-lg border border-border bg-background p-4">
                <p className="text-sm font-medium text-text-strong">Tutor</p>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <Field label="Seu nome">
                    <Input disabled={tutor.anonimo} value={tutor.nome} onChange={(e) => setTutor({ ...tutor, nome: e.target.value })} placeholder="Nome completo" />
                  </Field>
                  <Field label="Telefone">
                    <Input disabled={tutor.anonimo} value={tutor.telefone} onChange={(e) => setTutor({ ...tutor, telefone: e.target.value })} placeholder="(91) 9 0000 0000" />
                  </Field>
                </div>
                <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox checked={tutor.anonimo} onCheckedChange={(v) => setTutor({ ...tutor, anonimo: Boolean(v) })} />
                  Continuar sem cadastro (gera protocolo anônimo)
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nível de consciência">
                <Select value={estado.consciencia} onValueChange={(v) => setEstado({ ...estado, consciencia: v as typeof estado.consciencia })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alerta">Alerta</SelectItem>
                    <SelectItem value="apatico">Apático</SelectItem>
                    <SelectItem value="deprimido">Deprimido</SelectItem>
                    <SelectItem value="inconsciente">Inconsciente</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Apetite">
                <Select value={estado.apetite} onValueChange={(v) => setEstado({ ...estado, apetite: v as typeof estado.apetite })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="reduzido">Reduzido</SelectItem>
                    <SelectItem value="ausente">Ausente</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Hidratação">
                <Select value={estado.hidratacao} onValueChange={(v) => setEstado({ ...estado, hidratacao: v as typeof estado.hidratacao })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="leve">Leve desidratação</SelectItem>
                    <SelectItem value="moderada">Moderada</SelectItem>
                    <SelectItem value="grave">Grave</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Comportamento">
                <Select value={estado.comportamento} onValueChange={(v) => setEstado({ ...estado, comportamento: v as typeof estado.comportamento })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="agitado">Agitado</SelectItem>
                    <SelectItem value="isolado">Isolado</SelectItem>
                    <SelectItem value="agressivo">Agressivo</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}

          {step === 3 && (
            <div>
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar sintoma (ex. tosse, coceira, mancando)"
                className="mb-4"
              />
              <div className="space-y-5">
                {(Object.keys(grupos) as (keyof typeof sistemasLabel)[]).map((sis) => (
                  <div key={sis}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-soft">
                      {sistemasLabel[sis]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {grupos[sis].map((s) => {
                        const ativo = sintomaSel.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => toggleSintoma(s.id)}
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                              ativo
                                ? "border-primary bg-primary text-primary-foreground"
                                : s.redFlag
                                  ? "border-destructive/40 bg-destructive-50 text-destructive-700 hover:bg-destructive-50/80"
                                  : "border-border bg-background text-text-strong hover:bg-muted",
                            )}
                            aria-pressed={ativo}
                          >
                            {s.redFlag && <AlertTriangle className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />}
                            {s.nome}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-text-soft">
                Sintomas marcados em vermelho indicam possível emergência.
              </p>
            </div>
          )}

          {step === 4 && (
            <div>
              {sintomaSel.length === 0 ? (
                <EmptyState
                  titulo="Sem sintomas selecionados"
                  desc="Volte para a etapa 3 e selecione ao menos um."
                />
              ) : (
                <div className="space-y-3">
                  {sintomaSel.map((id) => {
                    const s = sintomaPorId(id);
                    return (
                      <div key={id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-3">
                        <div>
                          <p className="text-sm font-medium text-text-strong">{s?.nome}</p>
                          <p className="text-xs text-text-soft">{sistemasLabel[s!.sistema]}</p>
                        </div>
                        <Select
                          value={intensidade[id] ?? "moderada"}
                          onValueChange={(v) => setIntensidade({ ...intensidade, [id]: v as "leve" | "moderada" | "intensa" })}
                        >
                          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="leve">Leve</SelectItem>
                            <SelectItem value="moderada">Moderada</SelectItem>
                            <SelectItem value="intensa">Intensa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Quando começou?">
                <Select value={tempo.inicio} onValueChange={(v) => setTempo({ ...tempo, inicio: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["há poucas horas", "há 1 dia", "há 3 dias", "há 1 semana", "há 2 semanas", "há mais de 1 mês"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Duração">
                <Select value={tempo.duracao} onValueChange={(v) => setTempo({ ...tempo, duracao: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agudo">Agudo (de início súbito)</SelectItem>
                    <SelectItem value="subagudo">Subagudo</SelectItem>
                    <SelectItem value="crônico">Crônico (recorrente)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Ambiente">
                <Select value={ambiente.ambiente} onValueChange={(v) => setAmbiente({ ...ambiente, ambiente: v as typeof ambiente.ambiente })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domestico">Doméstico</SelectItem>
                    <SelectItem value="rua">Rua</SelectItem>
                    <SelectItem value="misto">Misto</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid gap-3 pt-2">
                <label className="flex items-center gap-2 text-sm text-text-strong">
                  <Checkbox checked={ambiente.contatoOutros} onCheckedChange={(v) => setAmbiente({ ...ambiente, contatoOutros: Boolean(v) })} />
                  Tem contato com outros animais
                </label>
                <label className="flex items-center gap-2 text-sm text-text-strong">
                  <Checkbox checked={ambiente.vacinado} onCheckedChange={(v) => setAmbiente({ ...ambiente, vacinado: Boolean(v) })} />
                  Vacinação em dia
                </label>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-5">
              <Field label="Conte com suas palavras o que está acontecendo">
                <Textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={5}
                  placeholder="Ex. está respirando rápido desde a manhã, não come desde ontem e a gengiva está pálida."
                />
              </Field>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={interpretar}>
                  <Sparkles className="mr-1.5 h-4 w-4" /> Interpretar texto
                </Button>
                <span className="text-xs text-text-soft">
                  A IA sugere sintomas com base no que você escreveu. Você confirma cada um.
                </span>
              </div>
              {chipsIA.length > 0 && (
                <div className="rounded-lg border border-primary-100 bg-primary-50 p-3">
                  <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary-800">
                    <Sparkles className="h-3.5 w-3.5" /> Interpretado por IA, confirme
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {chipsIA.map((id) => {
                      const s = sintomaPorId(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => aceitarChip(id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-surface px-3 py-1 text-sm text-primary-800 hover:bg-primary-100"
                        >
                          {s?.nome ?? id}
                          <span className="text-xs text-primary-700">adicionar</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {sintomaSel.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-soft">
                    Sintomas selecionados
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sintomaSel.map((id) => {
                      const s = sintomaPorId(id);
                      return (
                        <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm text-text-strong">
                          {s?.nome}
                          <button type="button" onClick={() => toggleSintoma(id)} aria-label="Remover">
                            <X className="h-3.5 w-3.5 text-text-soft" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                Anexo de foto estará disponível no próximo passo do produto.
                Hoje você pode descrever em texto. <MapPin className="ml-1 inline h-3 w-3" />
              </p>
            </div>
          )}

          {erro && (
            <div role="alert" className="mt-5 rounded-md border border-destructive/30 bg-destructive-50 px-3 py-2 text-sm text-destructive-700">
              {erro}
            </div>
          )}

          <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
            <Button type="button" variant="ghost" onClick={voltar} disabled={step === 1}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
            </Button>
            <Button type="button" onClick={avancar}>
              {step < 6 ? (
                <>Avançar <ArrowRight className="ml-1 h-4 w-4" /></>
              ) : (
                "Concluir triagem"
              )}
            </Button>
          </div>
        </Card>

        <p className="mt-4 text-center text-xs text-text-soft">
          Esta triagem é orientação. Um veterinário confirma no atendimento.
        </p>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-text-strong">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function EmptyState({ titulo, desc }: { titulo: string; desc: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-background p-6 text-center">
      <p className="font-display text-sm font-semibold text-text-strong">{titulo}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
