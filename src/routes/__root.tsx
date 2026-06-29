import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { VitalisStoreProvider } from "@/data/store";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-soft">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-text-strong">
          Página não encontrada
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-700"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight text-text-strong">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado. Tente novamente ou volte ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-700"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-strong transition-colors hover:bg-muted"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vitalis. Saúde pública veterinária de Belém" },
      {
        name: "description",
        content:
          "Plataforma oficial de triagem e atendimento veterinário da Prefeitura de Belém. Triagem online gratuita, orientação por especialidade e acesso à rede pública.",
      },
      { name: "author", content: "Prefeitura Municipal de Belém" },
      { property: "og:title", content: "Vitalis. Saúde pública veterinária de Belém" },
      {
        property: "og:description",
        content: "Triagem online gratuita e atendimento na rede veterinária municipal de Belém.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/__l5e/assets-v1/db731c28-5e09-4c99-8304-6c3cffb9d799/vitalis-logo.png" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:image", content: "/__l5e/assets-v1/db731c28-5e09-4c99-8304-6c3cffb9d799/vitalis-logo.png" },
      { name: "theme-color", content: "#0050cb" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "Vitalis" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "twitter:title", content: "Vitalis. Saúde pública veterinária de Belém" },
      { name: "description", content: "Pixel Perfect replicates UI designs from screenshots with high fidelity." },
      { property: "og:description", content: "Pixel Perfect replicates UI designs from screenshots with high fidelity." },
      { name: "twitter:description", content: "Pixel Perfect replicates UI designs from screenshots with high fidelity." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/jpeg", href: "/__l5e/assets-v1/db731c28-5e09-4c99-8304-6c3cffb9d799/vitalis-logo.png" },
      { rel: "shortcut icon", type: "image/jpeg", href: "/__l5e/assets-v1/db731c28-5e09-4c99-8304-6c3cffb9d799/vitalis-logo.png" },
      { rel: "apple-touch-icon", href: "/__l5e/assets-v1/db731c28-5e09-4c99-8304-6c3cffb9d799/vitalis-logo.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <VitalisStoreProvider>
        <Outlet />
        <Toaster richColors position="top-right" />
      </VitalisStoreProvider>
    </QueryClientProvider>
  );
}
