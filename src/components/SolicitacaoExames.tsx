import { useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { Check, FileText, Info, Search, Star, TestTube, Trash2, X } from "lucide-react";

interface Props {
  selecionados: string[];
  onToggle: (id: string) => void;
  onSetSelecionados: (ids: string[]) => void;
  observacoes: string;
  onObsChange: (v: string) => void;
  onSalvar: () => void;
}

function filtrarCategoria(cat: ExameCategoria, termo: string): ExameCategoria | null {
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

function ItemLinha({
  item,
  checked,
  onToggle,
}: {
  item: ExameItem;
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

export function SolicitacaoExames({
  selecionados,
  onToggle,
  onSetSelecionados,
  observacoes,
  onObsChange,
  onSalvar,
}: Props) {
  const [termo, setTermo] = useState("");

  const categoriasFiltradas = useMemo(
    () =>
      categoriasExames
        .map((c) => filtrarCategoria(c, termo))
        .filter((c): c is ExameCategoria => c !== null),
    [termo],
  );

  const openValues = useMemo(
    () => (termo ? categoriasFiltradas.map((c) => c.id) : undefined),
    [termo, categoriasFiltradas],
  );

  const selectAllCategoria = (cat: ExameCategoria) => {
    const ids = itensDaCategoria(cat).map((i) => i.id);
    const todosSel = ids.every((id) => selecionados.includes(id));
    if (todosSel) {
      onSetSelecionados(selecionados.filter((id) => !ids.includes(id)));
    } else {
      onSetSelecionados(Array.from(new Set([...selecionados, ...ids])));
    }
  };

  const aplicarPerfil = (ids: string[]) => {
    onSetSelecionados(Array.from(new Set([...selecionados, ...ids])));
  };

  const limparTudo = () => onSetSelecionados([]);

  const total = selecionados.length;
  const contagemPorCategoria = (cat: ExameCategoria) => {
    const ids = itensDaCategoria(cat).map((i) => i.id);
    return ids.filter((id) => selecionados.includes(id)).length;
  };

  const totalDaCategoria = (cat: ExameCategoria) => itensDaCategoria(cat).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TestTube className="h-4 w-4" /> Solicitação de exames complementares
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Coluna esquerda: catálogo */}
          <div className="space-y-4 min-w-0">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder="Buscar exame por nome (ex.: creatinina, T4, hemograma)"
                className="pl-9"
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Perfis favoritos
              </p>
              <div className="flex flex-wrap gap-2">
                {perfisFavoritos.map((p) => (
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

            {categoriasFiltradas.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                Nenhum exame encontrado para "{termo}".
              </div>
            ) : (
              <Accordion
                type="multiple"
                value={openValues}
                defaultValue={[categoriasExames[0]?.id ?? ""]}
                className="w-full"
              >
                {categoriasFiltradas.map((cat) => {
                  const sel = contagemPorCategoria(cat);
                  const tot = totalDaCategoria(cat);
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
                            onClick={() => selectAllCategoria(cat)}
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

          {/* Coluna direita: resumo sticky */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Resumo da solicitação</h4>
                <Badge variant={total > 0 ? "default" : "secondary"}>{total}</Badge>
              </div>
              <Separator className="my-3" />

              {total === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhum exame selecionado. Use a busca, os perfis favoritos ou os accordions ao lado.
                </p>
              ) : (
                <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                  {selecionados.map((id) => (
                    <div
                      key={id}
                      className="flex items-center gap-2 rounded-sm bg-card px-2 py-1.5 text-xs shadow-xs"
                    >
                      <span className="flex-1 min-w-0 truncate">{labelExame(id)}</span>
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

              <div className="mt-4">
                <Label htmlFor="obsExamesLab" className="text-xs">
                  Observações para o laboratório
                </Label>
                <Textarea
                  id="obsExamesLab"
                  rows={4}
                  value={observacoes}
                  onChange={(e) => onObsChange(e.target.value)}
                  placeholder="Jejum, prioridade, coletas especiais, contato do solicitante"
                  className="mt-1 text-sm"
                />
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Button variant="outline" className="gap-2" disabled={total === 0}>
                  <FileText className="h-4 w-4" /> Gerar guia de solicitação
                </Button>
                <Button onClick={onSalvar} className="gap-2" disabled={total === 0}>
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
