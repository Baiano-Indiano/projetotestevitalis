import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useVitalisStore } from "@/data/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  PawPrint,
  Cat,
  Calendar as CalendarIcon,
  UserCircle2,
  ClipboardList,
  Stethoscope,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";
import { calcularMotor } from "@/lib/triagem";
import { blocosEspecialidade, motivosConsulta, type BlocoEspecialidade } from "@/data/especialidades-perguntas";
import { nomeEspecialidade, type EspecialidadeId } from "@/config/municipio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tutor/triagem")({
  head: () => ({
    meta: [
      { title: "Triagem online. Vitalis Belém" },
      { name: "description", content: "Triagem online em três etapas, gratuita, validada por veterinário." },
    ],
  }),
  component: Triagem,
});

type Fase = 1 | 2 | 3;
type Respostas = Record<string, string | string[] | number>;

function Triagem() {
  const navigate = useNavigate();
  const { adicionarTriagem, setUltimaTriagemId } = useVitalisStore();
  const [fase, setFase] = useState<Fase>(1);

  // Fase 1
  const [especie, setEspecie] = useState<"cao" | "gato" | "">("");
  const [idadeValor, setIdadeValor] = useState("");
  const [idadeUnidade, setIdadeUnidade] = useState<"meses" | "anos">("anos");
  const [tutorNome, setTutorNome] = useState("");
  const [tutorCpf, setTutorCpf] = useState("");
  const [tutorTel, setTutorTel] = useState("");
  const [tutorEnd, setTutorEnd] = useState("");
  const [animalNome, setAnimalNome] = useState("");
  const [raca, setRaca] = useState("");
  const [motivo, setMotivo] = useState<EspecialidadeId | "geral" | "">("");

  // Fase 2 – respostas por especialidade
  const [respostas, setRespostas] = useState<Respostas>({});

  // Aceite
  const [aceite, setAceite] = useState(false);

  const bloco: BlocoEspecialidade | null = motivo ? blocosEspecialidade[motivo] : null;
  const Icone = bloco?.icone ?? Stethoscope;

  const valida1 = () =>
    Boolean(especie && idadeValor && tutorNome && tutorTel && tutorEnd && animalNome && motivo);

  // mapeia respostas em sintoma ids genéricos para o motor
  const sintomasInferidos = useMemo(() => {
    const ids: string[] = [];
    if (!bloco) return ids;
    const map: Record<string, string> = {
      coceira: "prurido",
      cansaco: "cansaco",
      respirar: "dispneia",
      desmaio: "colapso",
      manqueira: "claudicacao",
      trauma: "trauma",
      sangramento: "sangramento",
      nodulo: "nodulo",
      sede: "sede",
      peso: "perda-peso",
    };
    for (const p of bloco.perguntas) {
      const r = respostas[p.id];
      if (p.tipo === "simnao" && r === "Sim" && map[p.id]) ids.push(map[p.id]);
    }
    if (motivo && motivo !== "geral") {
      // garante peso mínimo para a especialidade escolhida
      const stubBySpec: Record<EspecialidadeId, string> = {
        cardiologia: "tosse",
        dermatologia: "prurido",
        ortopedia: "claudicacao",
        traumatologia: "trauma",
        nefrologia: "poliuria",
        oncologia: "nodulo",
        endocrinologia: "sede",
      };
      const stub = stubBySpec[motivo as EspecialidadeId];
      if (stub && !ids.includes(stub)) ids.push(stub);
    }
    return ids;
  }, [bloco, respostas, motivo]);

  const motor = useMemo(() => calcularMotor(sintomasInferidos), [sintomasInferidos]);
  const especialidadeFinal: EspecialidadeId | "urgencia" | "geral" =
    motor.redFlags.length > 0
      ? "urgencia"
      : motor.sugestao ?? (motivo === "geral" ? "geral" : (motivo as EspecialidadeId));

  const finalizar = () => {
    const t = adicionarTriagem({
      animal: {
        nome: animalNome,
        especie: especie || "outro",
        raca: raca || "Não informada",
        sexo: "macho",
        idade: `${idadeValor} ${idadeUnidade}`,
      },
      tutor: { nome: tutorNome, telefone: tutorTel },
      canal: "online",
      etapas: {
        sintomas: sintomasInferidos,
        observacoes: typeof respostas.obs === "string" ? respostas.obs : "",
        chipsIA: sintomasInferidos,
      },
      redFlags: motor.redFlags,
      scores: motor.scores,
      sugestao: especialidadeFinal === "geral" ? motor.sugestao : (especialidadeFinal as EspecialidadeId | "urgencia"),
      prioridade: motor.prioridade,
    });
    setUltimaTriagemId(t.id);
    navigate({ to: "/triagem/resultado" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Top bar com cancelar */}
      <div className="border-b border-border bg-surface">
        <div className="container-app flex h-14 items-center justify-between">
          <span className="font-display text-sm font-semibold text-text-strong">
            {fase === 1 ? "Triagem Online" : fase === 2 ? bloco?.nome : "Revisão"}
          </span>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-text-strong"
          >
            Cancelar triagem <X className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="container-app py-6 md:py-10">
        <div className="mx-auto max-w-2xl">
          {/* Tabs de progresso */}
          <Tabs fase={fase} bloco={bloco} />

          {fase === 1 && (
            <FaseInicial
              especie={especie}
              setEspecie={setEspecie}
              idadeValor={idadeValor}
              setIdadeValor={setIdadeValor}
              idadeUnidade={idadeUnidade}
              setIdadeUnidade={setIdadeUnidade}
              tutorNome={tutorNome} setTutorNome={setTutorNome}
              tutorCpf={tutorCpf} setTutorCpf={setTutorCpf}
              tutorTel={tutorTel} setTutorTel={setTutorTel}
              tutorEnd={tutorEnd} setTutorEnd={setTutorEnd}
              animalNome={animalNome} setAnimalNome={setAnimalNome}
              raca={raca} setRaca={setRaca}
              motivo={motivo} setMotivo={setMotivo}
            />
          )}

          {fase === 2 && bloco && (
            <FaseEspecialidade
              bloco={bloco}
              Icone={Icone}
              respostas={respostas}
              setRespostas={setRespostas}
            />
          )}

          {fase === 3 && (
            <FaseRevisao
              tutorNome={tutorNome}
              tutorTel={tutorTel}
              tutorEnd={tutorEnd}
              animalNome={animalNome}
              especie={especie}
              raca={raca}
              idade={`${idadeValor} ${idadeUnidade}`}
              especialidade={especialidadeFinal}
              respostas={respostas}
              bloco={bloco}
              aceite={aceite}
              setAceite={setAceite}
            />
          )}

          {/* Ações */}
          <div className={cn(
            "mt-6 grid gap-3",
            fase === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
          )}>
            {fase === 3 ? (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setFase(2)}
                  className="bg-primary-50 text-primary-800 border-transparent hover:bg-primary-100"
                >
                  Voltar e Editar
                </Button>
                <Button
                  size="lg"
                  disabled={!aceite}
                  onClick={finalizar}
                >
                  Finalizar e Enviar
                </Button>
              </>
            ) : fase === 2 ? (
              <>
                <Button variant="outline" size="lg" onClick={() => setFase(1)}>
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Anterior
                </Button>
                <Button size="lg" onClick={() => setFase(3)}>
                  Próximo <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                disabled={!valida1()}
                onClick={() => setFase(2)}
              >
                Próximo <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tabs({ fase, bloco }: { fase: Fase; bloco: BlocoEspecialidade | null }) {
  const items = [
    { id: 1, label: "Triagem Inicial" },
    { id: 2, label: bloco?.nome ?? "Especialidade" },
    { id: 3, label: "Revisão" },
  ];
  return (
    <div>
      <div className="grid grid-cols-3 text-center text-xs font-medium md:text-sm">
        {items.map((it) => {
          const ativo = fase === it.id;
          const passou = fase > it.id;
          return (
            <div
              key={it.id}
              className={cn(
                "pb-2 transition-colors",
                ativo ? "text-primary" : passou ? "text-success-700" : "text-text-soft",
              )}
            >
              {it.label}
            </div>
          );
        })}
      </div>
      <div className="grid h-1 grid-cols-3 overflow-hidden rounded-full bg-muted">
        <div className={cn("transition-colors", fase >= 1 ? "bg-success" : "bg-muted")} />
        <div className={cn("transition-colors", fase >= 2 ? (fase > 2 ? "bg-success" : "bg-primary") : "bg-muted")} />
        <div className={cn("transition-colors", fase >= 3 ? "bg-primary" : "bg-muted")} />
      </div>
    </div>
  );
}

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-6", className)}>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, titulo }: { icon: typeof PawPrint; titulo: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="font-display text-lg font-semibold text-text-strong">{titulo}</h2>
    </div>
  );
}

function FaseInicial(props: {
  especie: "cao" | "gato" | "";
  setEspecie: (v: "cao" | "gato") => void;
  idadeValor: string; setIdadeValor: (v: string) => void;
  idadeUnidade: "meses" | "anos"; setIdadeUnidade: (v: "meses" | "anos") => void;
  tutorNome: string; setTutorNome: (v: string) => void;
  tutorCpf: string; setTutorCpf: (v: string) => void;
  tutorTel: string; setTutorTel: (v: string) => void;
  tutorEnd: string; setTutorEnd: (v: string) => void;
  animalNome: string; setAnimalNome: (v: string) => void;
  raca: string; setRaca: (v: string) => void;
  motivo: EspecialidadeId | "geral" | "";
  setMotivo: (v: EspecialidadeId | "geral") => void;
}) {
  return (
    <div className="mt-6">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-text-strong md:text-3xl">
        Triagem Online
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Ajude-nos a entender a situação do seu animal para um atendimento mais ágil.
      </p>

      <SectionCard>
        <SectionHeader icon={PawPrint} titulo="Qual a espécie do seu animal?" />
        <div className="grid grid-cols-2 gap-3">
          <EspecieCard
            ativo={props.especie === "cao"}
            onClick={() => props.setEspecie("cao")}
            icone={<PawPrint className="h-6 w-6" />}
            label="Cão"
          />
          <EspecieCard
            ativo={props.especie === "gato"}
            onClick={() => props.setEspecie("gato")}
            icone={<Cat className="h-6 w-6" />}
            label="Gato"
          />
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader icon={CalendarIcon} titulo="Qual a idade aproximada?" />
        <div className="grid gap-3">
          <div>
            <Label className="text-sm">Valor</Label>
            <Input
              className="mt-1.5"
              placeholder="Ex: 2"
              inputMode="numeric"
              value={props.idadeValor}
              onChange={(e) => props.setIdadeValor(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-sm">Unidade de tempo</Label>
            <Select value={props.idadeUnidade} onValueChange={(v) => props.setIdadeUnidade(v as "anos" | "meses")}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="anos">Anos</SelectItem>
                <SelectItem value="meses">Meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="flex items-start gap-2 text-xs text-text-soft">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Se não souber a idade exata, uma estimativa ajuda nossa equipe.
          </p>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader icon={UserCircle2} titulo="Dados do Tutor" />
        <div className="grid gap-3">
          <Campo label="Nome completo">
            <Input value={props.tutorNome} onChange={(e) => props.setTutorNome(e.target.value)} placeholder="Seu nome completo" />
          </Campo>
          <Campo label="CPF">
            <Input value={props.tutorCpf} onChange={(e) => props.setTutorCpf(e.target.value)} placeholder="000.000.000-00" />
          </Campo>
          <Campo label="Telefone">
            <Input value={props.tutorTel} onChange={(e) => props.setTutorTel(e.target.value)} placeholder="(00) 00000-0000" />
          </Campo>
          <Campo label="Endereço">
            <Input value={props.tutorEnd} onChange={(e) => props.setTutorEnd(e.target.value)} placeholder="Rua, número, bairro" />
          </Campo>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader icon={ClipboardList} titulo="Dados do Animal e Motivo" />
        <div className="grid gap-3">
          <Campo label="Nome do animal">
            <Input value={props.animalNome} onChange={(e) => props.setAnimalNome(e.target.value)} placeholder="Ex: Rex" />
          </Campo>
          <Campo label="Raça (opcional)">
            <Input value={props.raca} onChange={(e) => props.setRaca(e.target.value)} placeholder="Ex: Labrador, SRD" />
          </Campo>
          <Campo label="Motivo principal da consulta">
            <Select value={props.motivo || undefined} onValueChange={(v) => props.setMotivo(v as EspecialidadeId | "geral")}>
              <SelectTrigger><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
              <SelectContent>
                {motivosConsulta.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{m.label}</span>
                      <span className="text-xs text-text-soft">{m.desc}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
        </div>
      </SectionCard>
    </div>
  );
}

function EspecieCard({ ativo, onClick, icone, label }: { ativo: boolean; onClick: () => void; icone: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border bg-background p-5 transition-all",
        ativo ? "border-primary bg-primary-50 ring-2 ring-primary/20" : "border-border hover:border-primary/40",
      )}
      aria-pressed={ativo}
    >
      <span className={cn("grid h-12 w-12 place-items-center rounded-full", ativo ? "bg-primary text-primary-foreground" : "bg-primary-50 text-primary")}>
        {icone}
      </span>
      <span className="text-sm font-semibold text-text-strong">{label}</span>
    </button>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function FaseEspecialidade({
  bloco,
  Icone,
  respostas,
  setRespostas,
}: {
  bloco: BlocoEspecialidade;
  Icone: typeof PawPrint;
  respostas: Respostas;
  setRespostas: (r: Respostas) => void;
}) {
  const setR = (id: string, v: string | string[] | number) =>
    setRespostas({ ...respostas, [id]: v });

  return (
    <SectionCard>
      <div className="mb-4 flex items-start gap-3 rounded-xl bg-destructive-50/40 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-destructive-50 text-destructive">
          <Icone className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-text-strong">{bloco.titulo}</h2>
          <p className="text-sm text-muted-foreground">{bloco.subtitulo}</p>
        </div>
      </div>

      <div className="space-y-5">
        {bloco.perguntas.map((p, i) => {
          const num = i + 1;
          const valor = respostas[p.id];
          return (
            <div key={p.id} className="space-y-2">
              <Label className="block text-sm font-semibold text-text-strong">
                {num}. {p.label}
              </Label>

              {p.tipo === "simnao" && (
                <div className="grid grid-cols-2 gap-3">
                  {["Sim", "Não"].map((opt) => {
                    const ativo = valor === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setR(p.id, opt)}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-all",
                          ativo ? "border-primary bg-primary-50 text-primary-800 font-medium" : "border-border bg-background hover:border-primary/40",
                        )}
                      >
                        <span className={cn("grid h-4 w-4 place-items-center rounded-full border-2", ativo ? "border-primary" : "border-border")}>
                          {ativo && <span className="h-2 w-2 rounded-full bg-primary" />}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {p.tipo === "checkbox" && p.opcoes && (
                <div className="space-y-2">
                  {p.opcoes.map((opt) => {
                    const arr = Array.isArray(valor) ? valor : [];
                    const ativo = arr.includes(opt);
                    return (
                      <label
                        key={opt}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                          ativo ? "border-primary bg-primary-50" : "border-border bg-background hover:bg-muted",
                        )}
                      >
                        <Checkbox
                          checked={ativo}
                          onCheckedChange={() => setR(p.id, ativo ? arr.filter((x) => x !== opt) : [...arr, opt])}
                        />
                        <span className="text-sm text-text-strong">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {p.tipo === "select" && p.opcoes && (
                <Select value={(valor as string) || undefined} onValueChange={(v) => setR(p.id, v)}>
                  <SelectTrigger><SelectValue placeholder={p.opcoes[0]} /></SelectTrigger>
                  <SelectContent>
                    {p.opcoes.slice(1).map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {p.tipo === "slider" && (
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-text-soft">{p.minLabel}</span>
                    <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {(valor as number) ?? 3}
                    </span>
                    <span className="text-xs text-text-soft">{p.maxLabel}</span>
                  </div>
                  <Slider
                    min={p.min ?? 1}
                    max={p.max ?? 5}
                    step={1}
                    value={[(valor as number) ?? 3]}
                    onValueChange={(v) => setR(p.id, v[0])}
                  />
                </div>
              )}

              {p.tipo === "textarea" && (
                <Textarea
                  rows={4}
                  placeholder={p.placeholder}
                  value={(valor as string) || ""}
                  onChange={(e) => setR(p.id, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function FaseRevisao({
  tutorNome, tutorTel, tutorEnd,
  animalNome, especie, raca, idade,
  especialidade,
  respostas,
  bloco,
  aceite, setAceite,
}: {
  tutorNome: string; tutorTel: string; tutorEnd: string;
  animalNome: string; especie: string; raca: string; idade: string;
  especialidade: EspecialidadeId | "urgencia" | "geral";
  respostas: Respostas;
  bloco: BlocoEspecialidade | null;
  aceite: boolean; setAceite: (v: boolean) => void;
}) {
  const especieLabel = especie === "cao" ? "Canina" : especie === "gato" ? "Felina" : "Outro";
  const especialidadeLabel = especialidade === "urgencia" ? "Urgência" : especialidade === "geral" ? "Clínica Geral" : nomeEspecialidade(especialidade as EspecialidadeId);

  const resumoSintomas: string[] = [];
  if (bloco) {
    for (const p of bloco.perguntas) {
      const r = respostas[p.id];
      if (p.tipo === "simnao" && r) resumoSintomas.push(`${r === "Sim" ? "" : "Sem "}${p.label.replace(/\?$/, "").toLowerCase()}`);
      if (p.tipo === "checkbox" && Array.isArray(r) && r.length) resumoSintomas.push(`${p.label.replace(/:$/, "")}: ${r.join(", ")}`);
      if (p.tipo === "select" && typeof r === "string" && r) resumoSintomas.push(`${p.label.replace(/:$/, "")}: ${r}`);
      if (p.tipo === "slider" && r) resumoSintomas.push(`Intensidade: ${r}/5`);
    }
  }
  const obs = typeof respostas.obs === "string" ? respostas.obs : "";

  return (
    <SectionCard>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-text-strong md:text-3xl">
        Revisão das Informações
      </h1>

      <Bloco titulo="Dados do Tutor" icone={UserCircle2}>
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <Item rotulo="Nome" valor={tutorNome} />
          <Item rotulo="Telefone" valor={tutorTel} />
          <Item rotulo="Endereço" valor={tutorEnd} className="sm:col-span-2" />
        </div>
      </Bloco>

      <Bloco titulo="Dados do Animal" icone={PawPrint}>
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-3">
          <Item rotulo="Nome" valor={animalNome} />
          <Item rotulo="Espécie" valor={especieLabel} />
          <Item rotulo="Raça" valor={raca || "Não informada"} />
          <Item rotulo="Idade" valor={idade} />
        </div>
      </Bloco>

      <Bloco titulo="Motivo da Consulta" icone={ClipboardList}>
        <div className="rounded-lg bg-primary-50 px-4 py-3">
          <p className="text-sm font-medium text-primary-800">
            <span className="mr-1 text-success">●</span>
            Especialidade Identificada: {especialidadeLabel}
          </p>
        </div>
      </Bloco>

      {resumoSintomas.length > 0 && (
        <Bloco titulo="Resumo da Triagem" icone={Stethoscope}>
          <ul className="space-y-1.5 text-sm text-text-strong">
            {resumoSintomas.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">•</span> {s}
              </li>
            ))}
          </ul>
        </Bloco>
      )}

      {obs && (
        <Bloco titulo="Observações Adicionais" icone={Info}>
          <div className="rounded-lg border border-border bg-background p-3 text-sm text-text-strong">
            {obs}
          </div>
        </Bloco>
      )}

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive-50 p-4 text-sm text-destructive-700">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          A triagem não substitui uma avaliação veterinária presencial. Em caso de emergência grave, dirija-se imediatamente à unidade.
        </p>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm text-text-strong">
        <Checkbox checked={aceite} onCheckedChange={(v) => setAceite(Boolean(v))} className="mt-0.5" />
        <span>
          Declaro que as informações fornecidas são verdadeiras e estou ciente de que a prioridade de atendimento é baseada na gravidade do quadro clínico.
        </span>
      </label>
    </SectionCard>
  );
}

function Bloco({ titulo, icone: Icone, children }: { titulo: string; icone: typeof PawPrint; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-border pt-5 first:border-t-0 first:pt-0">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Icone className="h-4 w-4" />
        <h3 className="font-display text-base font-semibold">{titulo}</h3>
      </div>
      {children}
    </div>
  );
}

function Item({ rotulo, valor, className }: { rotulo: string; valor: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs text-text-soft">{rotulo}</p>
      <p className="text-sm font-medium text-text-strong">{valor || "—"}</p>
    </div>
  );
}
