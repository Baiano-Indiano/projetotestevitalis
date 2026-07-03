import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Package,
  DollarSign,
  Tags,
  MapPin,
  AlertTriangle,
  Calendar,
  XCircle,
  ShoppingCart,
  Search,
  Download,
  Plus,
  Eye,
  Pencil,
  MoreVertical,
  ArrowDown,
  ArrowUp,
  Truck,
  FileText,
  History,
  FlaskConical,
  Syringe,
  Pill,
  Droplet,
  TestTube,
  Box,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useVitalisStore } from "@/data/store";

export const Route = createFileRoute("/_equipe/painel/estoque")({
  component: EstoquePage,
});

type StatusEstoque = "Estoque baixo" | "Em estoque" | "Vencendo em 30 dias" | "Sem estoque";

const statusStyles: Record<StatusEstoque, string> = {
  "Estoque baixo": "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50",
  "Em estoque": "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  "Vencendo em 30 dias": "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  "Sem estoque": "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
};

function getCategoriaVisual(categoria: string) {
  switch (categoria) {
    case "Medicamentos":
      return { color: "text-foreground", Icon: Pill, bg: "bg-red-50", iconColor: "text-red-500" };
    case "Materiais Descartáveis":
      return { color: "text-primary", Icon: Box, bg: "bg-slate-50", iconColor: "text-slate-500" };
    case "Materiais Laboratoriais":
      return { color: "text-primary", Icon: TestTube, bg: "bg-purple-50", iconColor: "text-indigo-500" };
    case "Vacinas":
      return { color: "text-primary", Icon: Syringe, bg: "bg-emerald-50", iconColor: "text-emerald-600" };
    default:
      return { color: "text-primary", Icon: Package, bg: "bg-blue-50", iconColor: "text-blue-500" };
  }
}

function getStatusEstoque(quantidade: number, alertaMinimo: number): StatusEstoque {
  if (quantidade === 0) return "Sem estoque";
  if (quantidade <= alertaMinimo) return "Estoque baixo";
  return "Em estoque";
}

function EstoquePage() {
  const [apenasAlertas, setApenasAlertas] = useState(false);
  const estoqueStore = useVitalisStore((s) => s.estoque);
  
  const itens = estoqueStore.map((it) => {
    const visual = getCategoriaVisual(it.categoria);
    const status = getStatusEstoque(it.quantidade, it.alertaMinimo);
    return {
      ...it,
      codigo: it.id.toUpperCase(),
      produto: it.nome,
      categoriaColor: visual.color,
      local: "Almoxarifado Geral",
      lote: "-",
      validade: "-",
      status,
      Icon: visual.Icon,
      iconBg: visual.bg,
      iconColor: visual.iconColor,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-strong">Logística e Estoque</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie insumos, materiais e medicamentos do hospital
          </p>
        </div>
        <Select defaultValue="hospital">
          <SelectTrigger className="w-[260px] rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hospital">Unidade: Hospital Vitalis</SelectItem>
            <SelectItem value="clinica">Unidade: Clínica Pedreira</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card className="rounded-2xl p-5 xl:col-span-1">
          <div className="text-sm font-semibold text-text-strong mb-4">Resumo do Estoque</div>
          <div className="grid grid-cols-2 gap-4">
            <ResumoItem Icon={Package} valor="1.248" label="Itens cadastrados" />
            <ResumoItem Icon={DollarSign} valor="R$ 324.560,80" label="Valor do estoque" />
            <ResumoItem Icon={Tags} valor="32" label="Categorias" />
            <ResumoItem Icon={MapPin} valor="8" label="Locais de estoque" />
          </div>
        </Card>

        <AlertCard
          Icon={AlertTriangle}
          titulo="Estoque baixo"
          valor="24"
          cta="Ver itens"
          tone="orange"
        />
        <AlertCard
          Icon={Calendar}
          titulo="Vencendo em 30 dias"
          valor="17"
          cta="Ver itens"
          tone="amber"
        />
        <AlertCard
          Icon={XCircle}
          titulo="Vencidos"
          valor="0"
          cta="Ver itens"
          tone="red"
        />
        <AlertCard
          Icon={ShoppingCart}
          titulo="Solicitações pendentes"
          valor="12"
          cta="Ver solicitações"
          tone="blue"
        />
      </div>

      {/* Tabs e tabela */}
      <Card className="rounded-2xl">
        <Tabs defaultValue="estoque" className="w-full">
          <div className="border-b border-border px-6 pt-4">
            <TabsList className="bg-transparent p-0 h-auto gap-6">
              {["estoque", "movimentacoes", "transferencias", "relatorios"].map((v) => (
                <TabsTrigger
                  key={v}
                  value={v}
                  className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 text-sm capitalize data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  {v === "movimentacoes" ? "Movimentações" : v === "transferencias" ? "Transferências" : v === "relatorios" ? "Relatórios" : "Estoque"}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="estoque" className="p-6 space-y-4 mt-0">
            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, código ou categoria..."
                  className="pl-9 rounded-xl"
                />
              </div>
              <FilterSelect label="Categoria" placeholder="Todas" />
              <FilterSelect label="Local" placeholder="Todos" />
              <FilterSelect label="Status" placeholder="Todos" />
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={apenasAlertas}
                  onCheckedChange={(c) => setApenasAlertas(c === true)}
                />
                Apenas alertas
              </label>
              <Button variant="outline" className="rounded-xl gap-2">
                <Download className="h-4 w-4" /> Exportar
              </Button>
              <Button className="rounded-xl gap-2">
                <Plus className="h-4 w-4" /> Adicionar Item
              </Button>
            </div>

            {/* Tabela */}
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="px-4">Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-4">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((it) => (
                    <TableRow key={it.codigo}>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-10 w-10 rounded-xl grid place-items-center", it.iconBg)}>
                            <it.Icon className={cn("h-5 w-5", it.iconColor)} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-text-strong">{it.produto}</div>
                            <div className="text-xs text-muted-foreground">Cód. {it.codigo}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={cn("text-sm", it.categoriaColor)}>{it.categoria}</TableCell>
                      <TableCell className="text-sm">{it.local}</TableCell>
                      <TableCell className="text-sm">{it.quantidade}</TableCell>
                      <TableCell className="text-sm">{it.unidade}</TableCell>
                      <TableCell className="text-sm">{it.lote}</TableCell>
                      <TableCell className="text-sm">{it.validade}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("rounded-full font-medium", statusStyles[it.status])}>
                          {it.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1 text-muted-foreground">
                          <button className="p-1.5 hover:bg-muted rounded-md"><Eye className="h-4 w-4" /></button>
                          <button className="p-1.5 hover:bg-muted rounded-md"><Pencil className="h-4 w-4" /></button>
                          <button className="p-1.5 hover:bg-muted rounded-md"><MoreVertical className="h-4 w-4" /></button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Mostrando 1 a 8 de 1.248 itens</span>
              <div className="flex items-center gap-1">
                {["‹", "1", "2", "3", "4", "5", "...", "156", "›"].map((p, i) => (
                  <button
                    key={i}
                    className={cn(
                      "h-8 min-w-8 rounded-md px-2 text-sm",
                      p === "1" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span>Itens por página:</span>
                <Select defaultValue="10">
                  <SelectTrigger className="w-[70px] h-8 rounded-md"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="movimentacoes" className="p-6 text-sm text-muted-foreground">
            Histórico completo de movimentações.
          </TabsContent>
          <TabsContent value="transferencias" className="p-6 text-sm text-muted-foreground">
            Transferências entre locais de estoque.
          </TabsContent>
          <TabsContent value="relatorios" className="p-6 text-sm text-muted-foreground">
            Relatórios consolidados.
          </TabsContent>
        </Tabs>
      </Card>

      {/* Rodapé */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-strong">Movimentações recentes</h3>
            <Button variant="outline" size="sm" className="rounded-lg">Ver todas</Button>
          </div>
          <div className="space-y-4">
            <MovimentacaoItem
              tipo="saida"
              produto="Dipirona 50% - Frasco 20ml"
              qtd="-2"
              local="Farmácia Principal"
              destinoLabel="Destino"
              destino="Atendimento #42491"
              responsavel="Dra. Marina Lopes"
              data="24/05/2024 15:32"
            />
            <MovimentacaoItem
              tipo="entrada"
              produto="Seringa 3ml - Unidade"
              qtd="+200"
              local="Almoxarifado"
              destinoLabel="Origem"
              destino="Fornecedor: Cirúrgica Vet"
              responsavel="João Oliveira"
              data="24/05/2024 10:14"
            />
          </div>
        </Card>

        <Card className="rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-text-strong mb-4">Atalhos rápidos</h3>
          <div className="grid grid-cols-2 gap-3">
            <AtalhoBtn Icon={ShoppingCart} label="Nova Solicitação" />
            <AtalhoBtn Icon={Truck} label="Transferência entre locais" />
            <AtalhoBtn Icon={FileText} label="Relatório de Estoque" />
            <AtalhoBtn Icon={History} label="Histórico de Movimentações" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function ResumoItem({ Icon, valor, label }: { Icon: React.ComponentType<{ className?: string }>; valor: string; label: string }) {
  return (
    <div>
      <Icon className="h-4 w-4 text-muted-foreground mb-2" />
      <div className="text-lg font-semibold text-text-strong leading-tight">{valor}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function AlertCard({
  Icon,
  titulo,
  valor,
  cta,
  tone,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  titulo: string;
  valor: string;
  cta: string;
  tone: "orange" | "amber" | "red" | "blue";
}) {
  const tones = {
    orange: { bg: "bg-orange-50/60 border-orange-100", icon: "text-orange-500", value: "text-orange-600", cta: "text-orange-600" },
    amber: { bg: "bg-amber-50/60 border-amber-100", icon: "text-amber-500", value: "text-amber-600", cta: "text-amber-600" },
    red: { bg: "bg-red-50/60 border-red-100", icon: "text-red-500", value: "text-red-600", cta: "text-red-600" },
    blue: { bg: "bg-blue-50/60 border-blue-100", icon: "text-blue-500", value: "text-blue-600", cta: "text-blue-600" },
  }[tone];

  return (
    <Card className={cn("rounded-2xl p-5 border", tones.bg)}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={cn("h-5 w-5", tones.icon)} />
        <span className="text-sm font-medium text-text-strong">{titulo}</span>
      </div>
      <div className={cn("text-3xl font-bold mb-2", tones.value)}>{valor}</div>
      <button className={cn("text-xs font-medium hover:underline", tones.cta)}>{cta}</button>
    </Card>
  );
}

function FilterSelect({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <Select>
        <SelectTrigger className="w-[160px] rounded-xl h-9">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">{placeholder}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function MovimentacaoItem({
  tipo,
  produto,
  qtd,
  local,
  destinoLabel,
  destino,
  responsavel,
  data,
}: {
  tipo: "entrada" | "saida";
  produto: string;
  qtd: string;
  local: string;
  destinoLabel: string;
  destino: string;
  responsavel: string;
  data: string;
}) {
  const isEntrada = tipo === "entrada";
  return (
    <div className="flex items-start gap-3">
      <div className={cn("h-9 w-9 rounded-full grid place-items-center shrink-0", isEntrada ? "bg-emerald-50" : "bg-red-50")}>
        {isEntrada ? (
          <ArrowUp className="h-4 w-4 text-emerald-600" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500" />
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-1 text-xs">
        <div>
          <div className="font-medium text-text-strong">{isEntrada ? "Entrada" : "Saída"}</div>
          <div className="text-muted-foreground">{produto}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Quantidade</div>
          <div className="font-medium text-text-strong">{qtd}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Local</div>
          <div className="font-medium text-text-strong">{local}</div>
        </div>
        <div>
          <div className="text-muted-foreground">{destinoLabel}</div>
          <div className="font-medium text-text-strong">{destino}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Responsável</div>
          <div className="font-medium text-text-strong">{responsavel}</div>
          <div className="text-muted-foreground mt-0.5">{data}</div>
        </div>
      </div>
    </div>
  );
}

function AtalhoBtn({ Icon, label }: { Icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface p-4 text-xs font-medium text-text-strong hover:bg-muted transition-colors">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
}
