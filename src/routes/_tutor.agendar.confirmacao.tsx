import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CalendarDays, Clock, Stethoscope, ArrowRight, Home, Info } from "lucide-react";
import { useVitalisStore } from "@/data/store";

export const Route = createFileRoute("/_tutor/agendar/confirmacao")({
  head: () => ({
    meta: [
      { title: "Agendamento confirmado. Vitalis Belém" },
      { name: "description", content: "Confirmação do agendamento com protocolo e próximos passos." },
    ],
  }),
  component: Confirmacao,
});

const fmtData = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function Confirmacao() {
  const navigate = useNavigate();
  const { agendamentos, ultimoAgendamentoId } = useVitalisStore();
  const agendamento = agendamentos.find((a) => a.id === ultimoAgendamentoId);

  const [bannerVisivel, setBannerVisivel] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setBannerVisivel(false), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!agendamento) navigate({ to: "/agendar" });
  }, [agendamento, navigate]);

  if (!agendamento) return null;

  const [ano, mes, dia] = agendamento.dataISO.split("-").map(Number);
  const dataFmt = fmtData.format(new Date(ano, mes - 1, dia));

  return (
    <div className="container-app py-6 md:py-10">
      <div className="mx-auto max-w-2xl">
        {bannerVisivel && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-success-foreground">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            <p className="text-sm font-medium text-text-strong">
              Agendamento confirmado com sucesso!
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold text-text-strong md:text-2xl">
                Tudo certo!
              </h1>
              <p className="text-sm text-muted-foreground">
                Guarde seu protocolo para acompanhamento.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-primary/40 bg-primary-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">Protocolo</p>
            <p className="font-mono text-lg font-semibold text-primary-900">
              {agendamento.protocolo}
            </p>
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-text-soft">Especialidade</p>
                <p className="font-medium text-text-strong">{agendamento.especialidadeNome}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-text-soft">Data</p>
                <p className="font-medium capitalize text-text-strong">{dataFmt}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-text-soft">Horário</p>
                <p className="font-medium text-text-strong">{agendamento.horario}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-display text-base font-semibold text-text-strong">Próximos passos</h2>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">1</span>
              Chegue à unidade com 15 minutos de antecedência.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">2</span>
              Leve documento do tutor e a carteirinha de vacinação do animal.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">3</span>
              Em caso de jejum (cirurgia/exame), siga as orientações enviadas pela equipe.
            </li>
          </ul>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Voltar ao início
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="flex-1">
            <Link to="/informacoes">
              <Info className="mr-2 h-4 w-4" /> Ver informações
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
