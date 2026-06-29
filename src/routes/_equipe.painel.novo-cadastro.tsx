import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  UserCircle2,
  PawPrint,
  ClipboardList,
  Stethoscope,
  Syringe,
  RotateCcw,
  Siren,
  TestTube,
  Scissors,
  UserRound,
  BedDouble,
  Truck,
  Camera,
  Search,
  Barcode,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_equipe/painel/novo-cadastro")({
  component: NovoCadastroPage,
});

const STEPS = [
  { n: 1, label: "Tutor" },
  { n: 2, label: "Animal" },
  { n: 3, label: "Motivo da visita" },
  { n: 4, label: "Triagem" },
  { n: 5, label: "Concluir" },
];

const MOTIVOS: { id: string; label: string; Icon: React.ComponentType<{ className?: string }>; danger?: boolean }[] = [
  { id: "consulta", label: "Consulta", Icon: Stethoscope },
  { id: "vacinacao", label: "Vacinação", Icon: Syringe },
  { id: "retorno", label: "Retorno", Icon: RotateCcw },
  { id: "emergencia", label: "Emergência", Icon: Siren, danger: true },
  { id: "exames", label: "Exames", Icon: TestTube },
  { id: "cirurgia", label: "Cirurgia", Icon: Scissors },
  { id: "especialidade", label: "Especialidade", Icon: UserRound },
  { id: "internacao", label: "Internação", Icon: BedDouble },
  { id: "unidade-movel", label: "Unidade Móvel", Icon: Truck },
];

const PERGUNTAS = [
  "Está comendo normalmente?",
  "Está bebendo água?",
  "Já vomitou?",
  "Teve diarreia?",
  "Está com dor?",
];

type Resposta = "sim" | "nao" | "na" | null;

function NovoCadastroPage() {
  const [castrado, setCastrado] = useState<"sim" | "nao" | null>(null);
  const [motivoAtivo, setMotivoAtivo] = useState<string | null>("consulta");
  const [respostas, setRespostas] = useState<Resposta[]>(Array(PERGUNTAS.length).fill(null));
  const [foto, setFoto] = useState<string | null>(null);

  const protocolo = useMemo(() => {
    const d = new Date();
    const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return `${ymd}-0001`;
  }, []);

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-strong">Cadastro Presencial</h1>
          <p className="text-sm text-muted-foreground">
            Cadastro de tutor e animal realizado na recepção
          </p>
        </div>
        <Stepper current={1} />
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="flex flex-col gap-5 lg:col-span-3">
          {/* Bloco 1 - Tutor */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-primary-50 text-primary">
                  <UserCircle2 className="h-4 w-4" />
                </span>
                1. Dados do Tutor
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="Nome completo" className="md:col-span-2">
                <Input placeholder="Ex: Maria Silva" />
              </Field>
              <Field label="CPF"><Input placeholder="000.000.000-00" /></Field>
              <Field label="Data de nascimento"><Input type="date" /></Field>
              <Field label="Telefone"><Input placeholder="(00) 0000-0000" /></Field>
              <Field label="WhatsApp"><Input placeholder="(00) 00000-0000" /></Field>
              <Field label="E-mail" className="md:col-span-2"><Input type="email" placeholder="email@exemplo.com" /></Field>
              <Field label="Endereço" className="md:col-span-2"><Input placeholder="Rua, número" /></Field>
              <Field label="Bairro"><Input /></Field>
              <Field label="CEP">
                <div className="relative">
                  <Input placeholder="00000-000" className="pr-9" />
                  <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>
              <Field label="Cidade"><Input /></Field>
              <Field label="Estado">
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {["PA","SP","RJ","MG","BA","RS","PR","SC","CE","PE","DF"].map(uf => (
                      <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Contato de emergência" className="md:col-span-2"><Input placeholder="Nome e telefone" /></Field>
              <Field label="Observações" className="md:col-span-2">
                <Textarea rows={3} placeholder="Observações adicionais sobre o tutor" />
              </Field>
            </CardContent>
          </Card>

          {/* Bloco 2 - Animal */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-primary-50 text-primary">
                  <PawPrint className="h-4 w-4" />
                </span>
                2. Dados do Animal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Field label="Nome do animal"><Input placeholder="Ex: Rex" /></Field>
                <Field label="Espécie">
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cao">Cão</SelectItem>
                      <SelectItem value="gato">Gato</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Raça">
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="srd">SRD</SelectItem>
                      <SelectItem value="labrador">Labrador</SelectItem>
                      <SelectItem value="poodle">Poodle</SelectItem>
                      <SelectItem value="siames">Siamês</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Field label="Sexo">
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="macho">Macho</SelectItem>
                      <SelectItem value="femea">Fêmea</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Idade"><Input placeholder="Ex: 3 anos" /></Field>
                <Field label="Data de nascimento"><Input type="date" /></Field>
                <Field label="Peso (kg)"><Input type="number" step="0.1" placeholder="0,0" /></Field>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Field label="Cor"><Input placeholder="Ex: Caramelo" /></Field>
                <Field label="Castrado?">
                  <div className="inline-flex rounded-md border border-border p-0.5">
                    {(["sim","nao"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setCastrado(v)}
                        className={cn(
                          "rounded-sm px-5 py-1.5 text-sm font-medium transition-colors",
                          castrado === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-text-strong",
                        )}
                      >
                        {v === "sim" ? "Sim" : "Não"}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Microchip">
                  <div className="relative">
                    <Input placeholder="Número do microchip" className="pr-9" />
                    <Barcode className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                <Field label="Tutor responsável">
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Selecione o tutor" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atual">Tutor cadastrado acima</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Foto do animal (opcional)">
                  <div className="flex items-center gap-2">
                    {foto && (
                      <img src={foto} alt="" className="h-10 w-14 rounded-md object-cover" />
                    )}
                    <label
                      htmlFor="foto-animal"
                      className="flex h-10 cursor-pointer items-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/40 px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <Camera className="h-4 w-4" />
                      Adicionar foto
                      <input
                        id="foto-animal"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const r = new FileReader();
                          r.onload = () => setFoto(r.result as string);
                          r.readAsDataURL(f);
                        }}
                      />
                    </label>
                  </div>
                </Field>
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Coluna direita */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          {/* Bloco 3 - Motivo */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-primary-50 text-primary">
                  <ClipboardList className="h-4 w-4" />
                </span>
                3. Motivo da visita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {MOTIVOS.map((m) => {
                  const active = motivoAtivo === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMotivoAtivo(m.id)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition-all",
                        active
                          ? "border-primary bg-primary-50 text-primary-800 shadow-sm"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-text-strong",
                        m.danger && active && "border-destructive bg-destructive/10 text-destructive",
                      )}
                    >
                      <m.Icon className={cn("h-5 w-5", m.danger ? "text-destructive" : "")} />
                      <span className="text-center leading-tight">{m.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4">
                <Label className="mb-2 block text-xs">Observações</Label>
                <Textarea rows={3} placeholder="Detalhes sobre o motivo da visita" />
              </div>
            </CardContent>
          </Card>

          {/* Bloco 4 - Triagem */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-primary-50 text-primary">
                  <ClipboardList className="h-4 w-4" />
                </span>
                4. Triagem Presencial
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-1.5">
                <UserRound className="h-3.5 w-3.5" /> Triagem Assistida
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <Field label="Qual o principal problema?">
                <Input placeholder="Descreva brevemente" />
              </Field>
              <Field label="Há quanto tempo?">
                <Input placeholder="Ex: 2 dias" />
              </Field>

              <div className="mt-2 space-y-1.5">
                {PERGUNTAS.map((p, i) => (
                  <div key={p} className="flex items-center justify-between gap-2 rounded-md px-1 py-1.5">
                    <span className="text-sm text-text-strong">{p}</span>
                    <div className="inline-flex overflow-hidden rounded-md border border-border">
                      {(["sim","nao","na"] as const).map((v) => {
                        const active = respostas[i] === v;
                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => {
                              const next = [...respostas];
                              next[i] = v;
                              setRespostas(next);
                            }}
                            className={cn(
                              "px-3 py-1 text-xs font-medium border-l border-border first:border-l-0 transition-colors",
                              active
                                ? "bg-primary text-primary-foreground"
                                : "bg-surface text-muted-foreground hover:bg-muted",
                            )}
                          >
                            {v === "sim" ? "Sim" : v === "nao" ? "Não" : "N/A"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button type="button" className="text-sm font-medium text-primary hover:underline">
                  Ver todas as perguntas
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Barra inferior fixa */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 px-4 py-3 shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.1)] backdrop-blur md:px-8 lg:left-72">
        <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Resultado da Triagem:</span>
              <Badge className="bg-success text-success-foreground hover:bg-success">Prioridade: Baixa</Badge>
            </div>
            <span className="text-muted-foreground">
              Especialidade sugerida: <span className="font-medium text-text-strong">Clínica Geral</span>
            </span>
            <span className="text-muted-foreground">
              Protocolo: <span className="font-mono font-medium text-text-strong">{protocolo}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Label className="text-xs text-muted-foreground">Encaminhar para:</Label>
            <Select defaultValue="triagem-vet">
              <SelectTrigger className="h-9 w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="triagem-vet">Triagem Veterinária</SelectItem>
                <SelectItem value="consulta">Consulta Direta</SelectItem>
                <SelectItem value="emergencia">Emergência</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" asChild>
              <Link to="/painel">Cancelar</Link>
            </Button>
            <Button
              onClick={() => toast.success("Cadastro salvo", { description: `Protocolo ${protocolo}`, icon: <Check className="h-4 w-4" /> })}
            >
              Salvar e Continuar →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-1.5">
      {STEPS.map((s, i) => {
        const active = s.n === current;
        const done = s.n < current;
        return (
          <li key={s.n} className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                active
                  ? "bg-primary text-primary-foreground"
                  : done
                    ? "bg-success/15 text-success"
                    : "bg-muted text-muted-foreground",
              )}
            >
              <span className={cn(
                "grid h-4 w-4 place-items-center rounded-full text-[10px] font-semibold",
                active ? "bg-primary-foreground/20" : done ? "bg-success/30" : "bg-surface",
              )}>
                {s.n}
              </span>
              {s.label}
            </span>
            {i < STEPS.length - 1 && <span className="text-muted-foreground">›</span>}
          </li>
        );
      })}
    </ol>
  );
}
