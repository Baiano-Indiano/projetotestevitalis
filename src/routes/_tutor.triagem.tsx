import { createFileRoute, Link, Outlet, useNavigate, useRouterState, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Lightbox } from "@/components/Lightbox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useVitalisStore } from "@/data/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  PawPrint,
  Cat,
  Calendar as CalendarIcon,
  UserCircle2,
  ClipboardList,
  Stethoscope,
  X,
  AlertTriangle,
  Info,
  ImagePlus,
} from "lucide-react";
import {
  categoriasParte1,
  categoriasParte2,
  calcularDeSelecionados,
  getItemById,
  type CategoriaSintoma,
} from "@/data/sintomas-categorias";
import { nomeEspecialidade, type EspecialidadeId } from "@/config/municipio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tutor/triagem")({
  validateSearch: (s: Record<string, unknown>) => ({
    edit: typeof s.edit === "string" ? s.edit : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Triagem online. Vitalis Belém" },
      { name: "description", content: "Triagem online em quatro etapas, gratuita, validada por veterinário." },
    ],
  }),
  component: TriagemRoute,
});

function TriagemRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== "/triagem") {
    return <Outlet />;
  }

  return <Triagem />;
}

type Fase = 1 | 2 | 3 | 4;
const TOTAL_FASES = 4;

function Triagem() {
  const navigate = useNavigate();
  const { adicionarTriagem, setUltimaTriagemId, triagens } = useVitalisStore();
  const { edit } = useSearch({ from: "/_tutor/triagem" });
  const [fase, setFase] = useState<Fase>(1);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

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
  const [sexo, setSexo] = useState<"macho" | "femea" | "">("");
  const [pelagem, setPelagem] = useState("");
  const [peso, setPeso] = useState("");

  // Fases 2 e 3 — sintomas
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [obs, setObs] = useState("");
  const [anexos, setAnexos] = useState<{ nome: string; url: string }[]>([]);

  const onAnexar = (files: FileList | null) => {
    if (!files) return;
    const restante = 5 - anexos.length;
    if (restante <= 0) {
      toast.error("Máximo de 5 fotos por triagem.");
      return;
    }
    const lista = Array.from(files).slice(0, restante);
    Promise.all(
      lista.map(
        (f) =>
          new Promise<{ nome: string; url: string } | null>((resolve) => {
            if (!f.type.startsWith("image/")) return resolve(null);
            if (f.size > 5 * 1024 * 1024) {
              toast.error(`${f.name} excede 5MB e foi ignorada.`);
              return resolve(null);
            }
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ nome: f.name, url: String(reader.result) });
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(f);
          }),
      ),
    ).then((res) => {
      const novos = res.filter((x): x is { nome: string; url: string } => !!x);
      if (novos.length) setAnexos((a) => [...a, ...novos]);
    });
  };

  const removerAnexo = (idx: number) =>
    setAnexos((a) => a.filter((_, i) => i !== idx));

  // Pré-preenchimento ao editar uma triagem existente (?edit=<id>)
  useEffect(() => {
    if (!edit) return;
    const t = triagens.find((x) => x.id === edit || x.protocolo === edit);
    if (!t) return;
    setEspecie(t.animal.especie === "cao" || t.animal.especie === "gato" ? t.animal.especie : "");
    setAnimalNome(t.animal.nome);
    setRaca(t.animal.raca);
    setSexo(t.animal.sexo);
    const [vNum, vUni] = String(t.animal.idade).split(" ");
    setIdadeValor(vNum ?? "");
    setIdadeUnidade(vUni === "meses" ? "meses" : "anos");
    setTutorNome(t.tutor.nome);
    setTutorTel(t.tutor.telefone);
    setSelecionados(new Set(t.etapas.sintomas ?? []));
    setObs(t.etapas.observacoes ?? "");
    if (t.etapas.anexos?.length) setAnexos(t.etapas.anexos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  // Aceite
  const [aceite, setAceite] = useState(false);

  const valida1 = () =>
    Boolean(especie && idadeValor && tutorNome && tutorTel && tutorEnd && animalNome);

  const toggle = (id: string) => {
    setSelecionados((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const ids = useMemo(() => Array.from(selecionados), [selecionados]);
  const motor = useMemo(() => calcularDeSelecionados(ids), [ids]);
  const especialidadeFinal: EspecialidadeId | "urgencia" = motor.sugestao;

  const tituloFase: Record<Fase, { titulo: string; subtitulo: string }> = {
    1: { titulo: "Triagem", subtitulo: "Dados iniciais" },
    2: { titulo: "Triagem", subtitulo: "Sintomas Detalhados" },
    3: { titulo: "Triagem", subtitulo: "Sintomas Detalhados (Continuação)" },
    4: { titulo: "Triagem", subtitulo: "Revisão e envio" },
  };

  const podeAvancar = (): boolean => {
    if (fase === 1) return valida1();
    if (fase === 2 || fase === 3) return true;
    return aceite;
  };

  const [enviando, setEnviando] = useState(false);

  const finalizar = async () => {
    if (enviando) return;
    setEnviando(true);
    const loadingId = toast.loading("Enviando sua triagem...");
    try {
      // pequena espera para feedback visual perceptível
      await new Promise((r) => setTimeout(r, 700));
      const t = adicionarTriagem({
        animal: {
          nome: animalNome,
          especie: especie || "outro",
          raca: raca || "Não informada",
          sexo: sexo || "macho",
          idade: `${idadeValor} ${idadeUnidade}`,
        },
        tutor: { nome: tutorNome, telefone: tutorTel },
        canal: "online",
        etapas: {
          sintomas: ids,
          observacoes: obs,
          chipsIA: ids,
          anexos: anexos.length ? anexos : undefined,
        },
        redFlags: motor.redFlags,
        scores: motor.scores,
        sugestao: especialidadeFinal,
        prioridade: motor.prioridade,
      });
      setUltimaTriagemId(t.id);
      toast.success("Triagem enviada com sucesso!", {
        id: loadingId,
        description: `Protocolo ${t.protocolo} gerado.`,
      });
      navigate({ to: "/triagem/resultado" });
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível enviar sua triagem. Tente novamente.", { id: loadingId });
      setEnviando(false);
    }
  };

  const progresso = Math.round((fase / TOTAL_FASES) * 100);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Overlay bloqueador durante o envio */}
      {enviando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm"
          aria-live="assertive"
          role="alert"
        >
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-8 py-6 shadow-lg">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm font-semibold text-text-strong">Enviando sua triagem...</p>
            <p className="text-xs text-muted-foreground">Não feche esta janela.</p>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="border-b border-border bg-surface">
        <div className="container-app flex h-14 items-center justify-between">
          <span className="font-display text-sm font-semibold text-text-strong">
            Triagem
          </span>
          {enviando ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground opacity-50">
              Cancelar triagem <X className="h-4 w-4" />
            </span>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-text-strong"
            >
              Cancelar triagem <X className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>


      <div className="container-app py-6 md:py-10">
        <div className="mx-auto max-w-2xl">
          {/* Cabeçalho com progresso */}
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-primary">
              {tituloFase[fase].titulo}
            </h1>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-base text-muted-foreground">{tituloFase[fase].subtitulo}</p>
              <span className="text-sm font-semibold text-primary">
                Etapa {fase} de {TOTAL_FASES}
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-success transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>

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
              sexo={sexo} setSexo={setSexo}
              pelagem={pelagem} setPelagem={setPelagem}
              peso={peso} setPeso={setPeso}
            />
          )}

          {fase === 2 && (
            <FaseSintomas
              categorias={categoriasParte1}
              selecionados={selecionados}
              toggle={toggle}
              instrucao="Selecione todos os sintomas que o paciente está apresentando no momento."
            />
          )}

          {fase === 3 && (
            <FaseSintomas
              categorias={categoriasParte2}
              selecionados={selecionados}
              toggle={toggle}
              instrucao="Continue marcando os sintomas observados. Quanto mais detalhes, mais preciso o encaminhamento."
              extra={
                <div className="mt-6 space-y-6">
                  <div>
                    <Label className="text-sm font-semibold text-text-strong">
                      Observações adicionais (opcional)
                    </Label>
                    <Textarea
                      rows={4}
                      className="mt-2"
                      placeholder="Há quanto tempo começou? Algo mais que devemos saber?"
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-text-strong">
                      Fotos do animal (opcional)
                    </Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Anexe até 5 fotos (máx. 5MB cada) para ajudar a equipe a contextualizar.
                    </p>

                    <label
                      htmlFor="anexos-triagem"
                      className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-6 text-center transition hover:bg-muted/50"
                    >
                      <ImagePlus className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium text-text-strong">
                        Toque para adicionar fotos
                      </span>
                      <span className="text-xs text-muted-foreground">
                        JPG, PNG ou HEIC — câmera ou galeria
                      </span>
                      <input
                        id="anexos-triagem"
                        type="file"
                        accept="image/*"
                        multiple
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          onAnexar(e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>

                    {anexos.length > 0 && (
                      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {anexos.map((a, i) => (
                          <li
                            key={`${a.nome}-${i}`}
                            className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
                          >
                            <button
                              type="button"
                              onClick={() => setLightboxIdx(i)}
                              className="absolute inset-0 h-full w-full cursor-zoom-in"
                              aria-label={`Ampliar ${a.nome}`}
                            >
                              <img
                                src={a.url}
                                alt={a.nome}
                                className="h-full w-full object-cover"
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => removerAnexo(i)}
                              aria-label={`Remover ${a.nome}`}
                              className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground shadow-sm transition hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              }
            />
          )}

          {fase === 4 && (
            <FaseRevisao
              tutorNome={tutorNome}
              tutorTel={tutorTel}
              tutorEnd={tutorEnd}
              animalNome={animalNome}
              especie={especie}
              raca={raca}
              idade={`${idadeValor} ${idadeUnidade}`}
              especialidade={especialidadeFinal}
              selecionados={ids}
              redFlags={motor.redFlags}
              obs={obs}
              aceite={aceite}
              setAceite={setAceite}
            />
          )}

          {/* Ações */}
          <div className={cn(
            "mt-6 grid gap-3",
            fase === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
          )}>
            {fase > 1 && (
              <Button
                variant="outline"
                size="lg"
                disabled={enviando}
                onClick={() => setFase((fase - 1) as Fase)}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Anterior
              </Button>
            )}
            {fase < TOTAL_FASES ? (
              <Button
                size="lg"
                disabled={!podeAvancar()}
                onClick={() => setFase((fase + 1) as Fase)}
              >
                Próximo <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button size="lg" disabled={!aceite || enviando} onClick={finalizar}>
                {enviando ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
                ) : (
                  "Finalizar e Enviar"
                )}
              </Button>
            )}
          </div>
        </div>
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
  sexo: "macho" | "femea" | ""; setSexo: (v: "macho" | "femea") => void;
  pelagem: string; setPelagem: (v: string) => void;
  peso: string; setPeso: (v: string) => void;
}) {
  return (
    <div>
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
        <SectionHeader icon={ClipboardList} titulo="Dados do Animal" />
        <div className="grid gap-3">
          <Campo label="Nome do animal">
            <Input value={props.animalNome} onChange={(e) => props.setAnimalNome(e.target.value)} placeholder="Ex: Rex" />
          </Campo>
          <Campo label="Raça (opcional)">
            <Input value={props.raca} onChange={(e) => props.setRaca(e.target.value)} placeholder="Ex: Labrador, SRD" />
          </Campo>
          <Campo label="Sexo">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => props.setSexo("macho")}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                  props.sexo === "macho" ? "border-primary bg-primary-50 text-primary" : "border-border bg-background text-text-strong hover:border-primary/40",
                )}
              >
                Macho
              </button>
              <button
                type="button"
                onClick={() => props.setSexo("femea")}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                  props.sexo === "femea" ? "border-primary bg-primary-50 text-primary" : "border-border bg-background text-text-strong hover:border-primary/40",
                )}
              >
                Fêmea
              </button>
            </div>
          </Campo>
          <Campo label="Pelagem (opcional)">
            <Input value={props.pelagem} onChange={(e) => props.setPelagem(e.target.value)} placeholder="Ex: curta preta, longa caramelo" />
          </Campo>
          <Campo label="Peso aproximado (opcional)">
            <Input value={props.peso} onChange={(e) => props.setPeso(e.target.value)} placeholder="Ex: 8 kg" inputMode="decimal" />
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

function FaseSintomas({
  categorias,
  selecionados,
  toggle,
  instrucao,
  extra,
}: {
  categorias: CategoriaSintoma[];
  selecionados: Set<string>;
  toggle: (id: string) => void;
  instrucao: string;
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <p className="mt-4 text-sm text-muted-foreground">{instrucao}</p>
      <div className="mt-4 space-y-4">
        {categorias.map((cat) => (
          <CategoriaCard key={cat.id} categoria={cat} selecionados={selecionados} toggle={toggle} />
        ))}
      </div>
      {extra}
    </div>
  );
}

function CategoriaCard({
  categoria,
  selecionados,
  toggle,
}: {
  categoria: CategoriaSintoma;
  selecionados: Set<string>;
  toggle: (id: string) => void;
}) {
  const Icone = categoria.icone;
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface border-t-4 p-4 shadow-sm",
        categoria.cor,
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icone className={cn("h-5 w-5", categoria.textoCor)} />
        <h2 className={cn("font-display text-base font-bold uppercase tracking-wide", categoria.textoCor)}>
          {categoria.nome}
        </h2>
      </div>
      <div className="space-y-1">
        {categoria.itens.map((it) => {
          const ativo = selecionados.has(it.id);
          return (
            <label
              key={it.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 transition-colors",
                ativo ? "bg-primary-50" : "hover:bg-muted",
              )}
            >
              <Checkbox
                checked={ativo}
                onCheckedChange={() => toggle(it.id)}
                className="mt-0.5"
              />
              <span className="text-sm leading-snug text-text-strong">
                {it.label}
                {it.redFlag && (
                  <AlertTriangle className="ml-1 inline h-3.5 w-3.5 text-destructive align-text-bottom" />
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function FaseRevisao({
  tutorNome, tutorTel, tutorEnd,
  animalNome, especie, raca, idade,
  especialidade,
  selecionados,
  redFlags,
  obs,
  aceite, setAceite,
}: {
  tutorNome: string; tutorTel: string; tutorEnd: string;
  animalNome: string; especie: string; raca: string; idade: string;
  especialidade: EspecialidadeId | "urgencia";
  selecionados: string[];
  redFlags: string[];
  obs: string;
  aceite: boolean; setAceite: (v: boolean) => void;
}) {
  const especieLabel = especie === "cao" ? "Canina" : especie === "gato" ? "Felina" : "Outro";
  const especialidadeLabel = especialidade === "urgencia" ? "Urgência" : nomeEspecialidade(especialidade);

  return (
    <SectionCard>
      {redFlags.length > 0 && (
        <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive-50 p-4 text-destructive-700">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-display text-sm font-semibold">Sinais de alerta detectados</p>
              <p className="mt-1 text-xs">
                Identificamos {redFlags.length} sinal(is) que requer(em) avaliação imediata. O atendimento será priorizado.
              </p>
            </div>
          </div>
        </div>
      )}

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

      <Bloco titulo="Encaminhamento sugerido" icone={Stethoscope}>
        <div className="rounded-lg bg-primary-50 px-4 py-3">
          <p className="text-sm font-medium text-primary-800">
            <span className={cn("mr-1", especialidade === "urgencia" ? "text-destructive" : "text-success")}>●</span>
            {especialidadeLabel}
          </p>
          <p className="mt-1 text-xs text-text-soft">
            Calculado a partir dos {selecionados.length} sintoma(s) marcado(s). Validado por veterinário antes do atendimento.
          </p>
        </div>
      </Bloco>

      {selecionados.length > 0 && (
        <Bloco titulo={`Sintomas marcados (${selecionados.length})`} icone={ClipboardList}>
          <ul className="flex flex-wrap gap-2">
            {selecionados.map((id) => {
              const it = getItemById(id);
              if (!it) return null;
              return (
                <li
                  key={id}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs",
                    it.redFlag
                      ? "border-destructive/40 bg-destructive-50 text-destructive-700"
                      : "border-border bg-muted text-text-strong",
                  )}
                >
                  {it.label}
                </li>
              );
            })}
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
