import { useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  categoriasExames,
  itensDaCategoria,
  labelExame,
  perfisFavoritos,
  todosItens,
  type ExameCategoria,
  type ExameItem,
} from "@/data/exames-catalogo";
import {
  categoriasImagem,
  itensDaCategoriaImagem,
  labelImagem,
  perfisImagem,
  projecoesRadiografia,
  todosItensImagem,
  type ImagemCategoria,
} from "@/data/imagem-catalogo";
import {
  AlertTriangle,
  Check,
  FileText,
  Info,
  Paperclip,
  Radiation,
  Search,
  Star,
  TestTube,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  selecionados: string[];
  onToggle: (id: string) => void;
  onSetSelecionados: (ids: string[]) => void;
  observacoes: string;
  onObsChange: (v: string) => void;
  onSalvar: () => void;
}

type CatalogoGenerico = {
  id: string;
  nome: string;
  itens?: { id: string; label: string; desc?: string }[];
  subgrupos?: { nome: string; itens: { id: string; label: string; desc?: string }[] }[];
};

function filtrar(cat: CatalogoGenerico, termo: string): CatalogoGenerico | null {
  if (!termo) return cat;
  const t = termo.toLowerCase();
  if (cat.itens) {
    const itens = cat.itens.filter((i) => i.label.toLowerCase().includes(t));
    return itens.length ? { ...cat, itens } : null;
  }
  if (cat.subgrupos) {
    const subgrupos = cat.subgrupos
      .map((s) => ({ ...s, itens: s.itens.filter((i) => i.label.toLowerCase().includes(t)) }))
      .filter((s) => s.itens.length);
    return subgrupos.length ? { ...cat, subgrupos } : null;
  }
  return null;
}

function itensDe(cat: CatalogoGenerico) {
  if (cat.itens) return cat.itens;
  return cat.subgrupos?.flatMap((s) => s.itens) ?? [];
}

function ItemLinha({
  item,
  checked,
  onToggle,
}: {
  item: { id: string; label: string; desc?: string };
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors ${
        checked ? "border-primary/50 bg-primary/5" : "border-border bg-card hover:bg-muted"
      }`}
    >
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <span className="flex-1 min-w-0 truncate">{item.label}</span>
      {item.desc ? (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label={`Informação sobre ${item.label}`}
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">{item.desc}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </label>
  );
}

function labelGlobal(id: string): string {
  return labelExame(id) !== id ? labelExame(id) : (labelImagem(id) ?? id);
}

function CatalogoLista({
  categorias,
  perfis,
  termo,
  onTermo,
  placeholder,
  selecionados,
  onToggle,
  onSetSelecionados,
  defaultOpen,
}: {
  categorias: (ExameCategoria | ImagemCategoria)[];
  perfis: { id: string; nome: string; descricao: string; itens: string[] }[];
  termo: string;
  onTermo: (v: string) => void;
  placeholder: string;
  selecionados: string[];
  onToggle: (id: string) => void;
  onSetSelecionados: (ids: string[]) => void;
  defaultOpen?: string;
}) {
  const filtradas = useMemo(
    () =>
      categorias
        .map((c) => filtrar(c as CatalogoGenerico, termo))
        .filter((c): c is CatalogoGenerico => c !== null),
    [categorias, termo],
  );
  const openValues = useMemo(
    () => (termo ? filtradas.map((c) => c.id) : undefined),
    [termo, filtradas],
  );

  const aplicarPerfil = (ids: string[]) =>
    onSetSelecionados(Array.from(new Set([...selecionados, ...ids])));

  const selectAll = (cat: CatalogoGenerico) => {
    const ids = itensDe(cat).map((i) => i.id);
    const todosSel = ids.every((id) => selecionados.includes(id));
    if (todosSel) onSetSelecionados(selecionados.filter((id) => !ids.includes(id)));
    else onSetSelecionados(Array.from(new Set([...selecionados, ...ids])));
  };

  return (
    <div className="space-y-4 min-w-0">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={termo}
          onChange={(e) => onTermo(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Perfis favoritos
        </p>
        <div className="flex flex-wrap gap-2">
          {perfis.map((p) => (
            <TooltipProvider key={p.id} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => aplicarPerfil(p.itens)}
                  >
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    {p.nome}
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                      {p.itens.length}
                    </Badge>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">{p.descricao}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {filtradas.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nenhum exame encontrado para "{termo}".
        </div>
      ) : (
        <Accordion
          type="multiple"
          value={openValues}
          defaultValue={defaultOpen ? [defaultOpen] : [categorias[0]?.id ?? ""]}
          className="w-full"
        >
          {filtradas.map((cat) => {
            const ids = itensDe(cat).map((i) => i.id);
            const sel = ids.filter((id) => selecionados.includes(id)).length;
            const tot = ids.length;
            const todosMarcados = sel === tot && tot > 0;
            return (
              <AccordionItem key={cat.id} value={cat.id}>
                <AccordionTrigger className="hover:no-underline">
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{cat.nome}</span>
                    {sel > 0 ? (
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                        {sel}/{tot}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">{tot} exames</span>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mb-2 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => selectAll(cat)}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {todosMarcados ? "Desmarcar todos" : "Selecionar todos"}
                    </Button>
                  </div>
                  {cat.itens ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {cat.itens.map((item) => (
                        <ItemLinha
                          key={item.id}
                          item={item}
                          checked={selecionados.includes(item.id)}
                          onToggle={() => onToggle(item.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cat.subgrupos?.map((s) => (
                        <div key={s.nome}>
                          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {s.nome}
                          </p>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {s.itens.map((item) => (
                              <ItemLinha
                                key={item.id}
                                item={item}
                                checked={selecionados.includes(item.id)}
                                onToggle={() => onToggle(item.id)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}

export function SolicitacaoExames({
  selecionados,
  onToggle,
  onSetSelecionados,
  observacoes,
  onObsChange,
  onSalvar,
}: Props) {
  const [aba, setAba] = useState<"lab" | "img">("lab");
  const [termoLab, setTermoLab] = useState("");
  const [termoImg, setTermoImg] = useState("");

  // Extras (locais)
  const [suspeita, setSuspeita] = useState("");
  const [urgencia, setUrgencia] = useState(false);
  const [projecoes, setProjecoes] = useState<string[]>([]);
  const [extras, setExtras] = useState({
    contraste: false,
    semContraste: false,
    sedacao: false,
    anestesia: false,
  });
  const [anexos, setAnexos] = useState<{ nome: string; tamanho: number }[]>([]);

  const idsLab = useMemo(() => new Set(todosItens().map((i) => i.id)), []);
  const idsImg = useMemo(() => new Set(todosItensImagem().map((i) => i.id)), []);
  const selLab = selecionados.filter((id) => idsLab.has(id));
  const selImg = selecionados.filter((id) => idsImg.has(id));

  const temRadiografia = selImg.some((id) => id.startsWith("img-rx-"));

  const total = selecionados.length;
  const limparTudo = () => onSetSelecionados([]);

  const toggleProjecao = (p: string) =>
    setProjecoes((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const handleAnexar = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).map((f) => ({ nome: f.name, tamanho: f.size }));
    setAnexos((prev) => [...prev, ...list]);
    toast.success(`${list.length} arquivo(s) anexado(s)`);
  };

  const salvar = () => {
    if (!suspeita.trim()) {
      toast.error("Informe a suspeita clínica antes de gerar a guia.");
      return;
    }
    onSalvar();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TestTube className="h-4 w-4" /> Solicitação de exames complementares
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Coluna esquerda: catálogo com abas */}
          <div className="min-w-0">
            <Tabs value={aba} onValueChange={(v) => setAba(v as "lab" | "img")}>
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="lab" className="gap-2">
                  <TestTube className="h-4 w-4" /> Análises Clínicas
                  {selLab.length > 0 ? (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                      {selLab.length}
                    </Badge>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="img" className="gap-2">
                  <Radiation className="h-4 w-4" /> Diagnóstico por Imagem
                  {selImg.length > 0 ? (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                      {selImg.length}
                    </Badge>
                  ) : null}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lab" className="mt-0">
                <CatalogoLista
                  categorias={categoriasExames}
                  perfis={perfisFavoritos}
                  termo={termoLab}
                  onTermo={setTermoLab}
                  placeholder="Buscar exame por nome (ex.: creatinina, T4, hemograma)"
                  selecionados={selecionados}
                  onToggle={onToggle}
                  onSetSelecionados={onSetSelecionados}
                />
              </TabsContent>

              <TabsContent value="img" className="mt-0 space-y-4">
                <CatalogoLista
                  categorias={categoriasImagem}
                  perfis={perfisImagem}
                  termo={termoImg}
                  onTermo={setTermoImg}
                  placeholder="Buscar exame ou região (ex.: tórax, abdome, joelho)"
                  selecionados={selecionados}
                  onToggle={onToggle}
                  onSetSelecionados={onSetSelecionados}
                />

                {temRadiografia ? (
                  <div className="rounded-md border bg-muted/30 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Projeções radiográficas
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {projecoesRadiografia.map((p) => {
                        const active = projecoes.includes(p);
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => toggleProjecao(p)}
                            className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card hover:bg-muted"
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                    <Separator className="my-3" />
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(
                        [
                          ["contraste", "Com contraste"],
                          ["semContraste", "Sem contraste"],
                          ["sedacao", "Sedação necessária"],
                          ["anestesia", "Anestesia necessária"],
                        ] as const
                      ).map(([key, label]) => (
                        <label
                          key={key}
                          className="flex cursor-pointer items-center gap-2 rounded-sm border bg-card px-3 py-2 text-sm hover:bg-muted"
                        >
                          <Checkbox
                            checked={extras[key]}
                            onCheckedChange={(v) =>
                              setExtras((prev) => ({ ...prev, [key]: v === true }))
                            }
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          </div>

          {/* Coluna direita: resumo global sticky */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Resumo da solicitação</h4>
                <Badge variant={total > 0 ? "default" : "secondary"}>{total}</Badge>
              </div>
              <Separator className="my-3" />

              {total === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhum exame selecionado. Use as abas para escolher análises clínicas ou exames de imagem.
                </p>
              ) : (
                <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                  {selLab.length > 0 ? (
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Análises clínicas ({selLab.length})
                      </p>
                      <div className="space-y-1.5">
                        {selLab.map((id) => (
                          <div
                            key={id}
                            className="flex items-center gap-2 rounded-sm bg-card px-2 py-1.5 text-xs shadow-xs"
                          >
                            <span className="flex-1 min-w-0 truncate">{labelGlobal(id)}</span>
                            <button
                              type="button"
                              onClick={() => onToggle(id)}
                              className="shrink-0 text-muted-foreground hover:text-destructive"
                              aria-label="Remover"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {selImg.length > 0 ? (
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Diagnóstico por imagem ({selImg.length})
                      </p>
                      <div className="space-y-1.5">
                        {selImg.map((id) => (
                          <div
                            key={id}
                            className="flex items-center gap-2 rounded-sm bg-card px-2 py-1.5 text-xs shadow-xs"
                          >
                            <span className="flex-1 min-w-0 truncate">{labelGlobal(id)}</span>
                            <button
                              type="button"
                              onClick={() => onToggle(id)}
                              className="shrink-0 text-muted-foreground hover:text-destructive"
                              aria-label="Remover"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {total > 0 ? (
                <button
                  type="button"
                  onClick={limparTudo}
                  className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" /> Limpar seleção
                </button>
              ) : null}

              <Separator className="my-4" />

              <div className="space-y-3">
                <div>
                  <Label htmlFor="suspeitaClinica" className="text-xs">
                    Suspeita clínica <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="suspeitaClinica"
                    rows={2}
                    value={suspeita}
                    onChange={(e) => setSuspeita(e.target.value)}
                    placeholder="Hipótese principal que motiva a solicitação"
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="obsExamesLab" className="text-xs">
                    Observações / Diretrizes
                  </Label>
                  <Textarea
                    id="obsExamesLab"
                    rows={3}
                    value={observacoes}
                    onChange={(e) => onObsChange(e.target.value)}
                    placeholder="Jejum, prioridade, coletas especiais, contato do solicitante"
                    className="mt-1 text-sm"
                  />
                </div>

                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors ${
                    urgencia
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <Checkbox
                    checked={urgencia}
                    onCheckedChange={(v) => setUrgencia(v === true)}
                    className={urgencia ? "border-destructive data-[state=checked]:bg-destructive" : ""}
                  />
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">URGÊNCIA</span>
                </label>

                <div>
                  <Label htmlFor="anexosExames" className="text-xs">
                    Anexar imagens ou exames anteriores
                  </Label>
                  <div className="mt-1">
                    <input
                      id="anexosExames"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleAnexar(e.target.files)}
                    />
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full cursor-pointer gap-2"
                    >
                      <label htmlFor="anexosExames">
                        <Paperclip className="h-4 w-4" /> Selecionar arquivos
                      </label>
                    </Button>
                  </div>
                  {anexos.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {anexos.map((a, i) => (
                        <li
                          key={`${a.nome}-${i}`}
                          className="flex items-center gap-2 rounded-sm bg-card px-2 py-1 text-[11px]"
                        >
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                          <span className="flex-1 min-w-0 truncate">{a.nome}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setAnexos((prev) => prev.filter((_, idx) => idx !== i))
                            }
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Remover anexo"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Button variant="outline" className="gap-2" disabled={total === 0}>
                  <FileText className="h-4 w-4" /> Gerar guia de solicitação
                </Button>
                <Button onClick={salvar} className="gap-2" disabled={total === 0}>
                  <Check className="h-4 w-4" /> Salvar diagnóstico
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { todosItens };
