import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { municipio } from "@/config/municipio";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { pageVariants, pageTransition } from "@/lib/motion";

const nav = [
  { to: "/", label: "Início" },
  { to: "/informacoes", label: "Como funciona" },
  { to: "/unidades", label: "Unidades" },
];

export function TutorShell() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
        <div className="container-app flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <Logo size="lg" />
            <span className="hidden text-xs font-medium text-text-soft sm:inline">
              {municipio.cidade}
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-text-strong"
                activeProps={{ className: "text-text-strong bg-muted" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden lg:block"><RoleSwitcher /></div>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/triagem">Iniciar triagem</Link>
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-md p-2 text-muted-foreground md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className={cn("border-t border-border md:hidden", open ? "block" : "hidden")}>
          <div className="container-app flex flex-col gap-1 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-2"><RoleSwitcher /></div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="container-app flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Logo mark size="md" />
            <div>
              <p className="text-sm font-medium text-text-strong">{municipio.nomeRede}</p>
              <p className="text-xs text-text-soft">{municipio.prefeitura}</p>
            </div>
          </div>
          <p className="text-xs text-text-soft">
            Serviço oficial e gratuito. O Vitalis orienta, o veterinário decide.
          </p>
        </div>
      </footer>
    </div>
  );
}
