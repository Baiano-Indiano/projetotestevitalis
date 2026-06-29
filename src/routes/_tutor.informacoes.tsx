import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FolderOpen, Clock, Stethoscope, AlertTriangle, Plus, Shield, Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tutor/informacoes")({
  head: () => ({
    meta: [
      { title: "Central de informações para tutores. Vitalis Belém" },
      { name: "description", content: "Tudo que você precisa saber para garantir o melhor atendimento do seu pet na rede municipal." },
    ],
  }),
  component: Informacoes,
});

const cards = [
  { icone: FolderOpen, titulo: "Documentos Necessários", desc: "RG, CPF do tutor e comprovante de residência atualizado.", cor: "primary" as const },
  { icone: Clock, titulo: "Horários", desc: "Atendimento das 08h às 17h para triagem. Urgências 24h (Hospital).", cor: "success" as const },
  { icone: Stethoscope, titulo: "Serviços", desc: "Consultas, vacinas, cirurgias e exames laboratoriais.", cor: "muted" as const },
  { icone: AlertTriangle, titulo: "Emergências", desc: "O que configura uma emergência médica e como proceder.", cor: "destructive" as const },
];

const corMap = {
  primary: { card: "bg-surface border-border", icon: "bg-primary-50 text-primary" },
  success: { card: "bg-surface border-border", icon: "bg-success-50 text-success-700" },
  muted: { card: "bg-surface border-border", icon: "bg-muted text-muted-foreground" },
  destructive: { card: "bg-destructive-50/60 border-destructive/30", icon: "bg-destructive-50 text-destructive" },
};

const faqs = [
  { p: "O serviço é gratuito?", r: "Sim. Todos os atendimentos da rede municipal Vitalis Belém são oferecidos gratuitamente pela Prefeitura, mediante triagem e cadastro do tutor." },
  { p: "Posso agendar por telefone?", r: "O agendamento principal é feito online ou nas unidades móveis. Em casos específicos, ligue para a Clínica Municipal Centro: (91) 3000 0001." },
  { p: "Atendem animais silvestres?", r: "Animais silvestres apreendidos ou resgatados devem ser encaminhados ao IBAMA. Atendemos apenas cães, gatos e pequenos roedores domésticos." },
];

function Informacoes() {
  const [abertos, setAbertos] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    const novo = new Set(abertos);
    if (novo.has(i)) novo.delete(i); else novo.add(i);
    setAbertos(novo);
  };

  return (
    <div className="container-app py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Central de Informações para Tutores
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Tudo o que você precisa saber para garantir o melhor atendimento para o seu pet na nossa rede municipal.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {cards.map((c) => {
            const cor = corMap[c.cor];
            const Icone = c.icone;
            return (
              <div key={c.titulo} className={cn("rounded-2xl border p-5 shadow-sm", cor.card)}>
                <span className={cn("grid h-10 w-10 place-items-center rounded-xl", cor.icon)}>
                  <Icone className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-text-strong">
                  {c.titulo}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Entenda a Diferença */}
        <div className="mt-8 rounded-2xl border border-border bg-primary-50/40 p-5 md:p-6">
          <h2 className="text-center font-display text-xl font-semibold text-text-strong">
            Entenda a Diferença
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="inline-flex items-center gap-2 font-display text-base font-semibold text-primary">
                <Plus className="h-4 w-4" /> Clínica Veterinária
              </p>
              <ul className="mt-3 space-y-2 text-sm text-text-strong">
                <Beneficio>Consultas de rotina e preventivas.</Beneficio>
                <Beneficio>Vacinação e vermifugação.</Beneficio>
                <Beneficio>Curativos simples e orientações.</Beneficio>
                <Beneficio negada>Não possui internação ou UTI.</Beneficio>
              </ul>
            </div>

            <div className="rounded-xl border-l-4 border-l-destructive border-y border-r border-border bg-surface p-5">
              <p className="inline-flex items-center gap-2 font-display text-base font-semibold text-destructive">
                <Shield className="h-4 w-4" /> Hospital Veterinário
              </p>
              <ul className="mt-3 space-y-2 text-sm text-text-strong">
                <Beneficio>Atendimento de emergências e traumas complexos.</Beneficio>
                <Beneficio>Cirurgias ortopédicas e tecidos moles.</Beneficio>
                <Beneficio>Internação com monitoramento contínuo.</Beneficio>
                <Beneficio>Atendimento 24h para casos graves.</Beneficio>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10">
          <h2 className="text-center font-display text-xl font-semibold text-text-strong md:text-2xl">
            Dúvidas Frequentes (FAQ)
          </h2>
          <div className="mx-auto mt-5 max-w-xl space-y-2">
            {faqs.map((f, i) => {
              const aberto = abertos.has(i);
              return (
                <div key={i} className="overflow-hidden rounded-xl border border-border bg-surface">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    aria-expanded={aberto}
                  >
                    <span className="text-sm font-medium text-text-strong">{f.p}</span>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 text-text-soft transition-transform", aberto && "rotate-180")} />
                  </button>
                  {aberto && (
                    <div className="border-t border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                      {f.r}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Beneficio({ children, negada }: { children: React.ReactNode; negada?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      {negada ? (
        <X className="mt-0.5 h-4 w-4 shrink-0 text-text-soft" />
      ) : (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
      )}
      <span className={cn(negada && "text-text-soft")}>{children}</span>
    </li>
  );
}
