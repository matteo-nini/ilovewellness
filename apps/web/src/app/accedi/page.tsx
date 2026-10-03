import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { Notice } from "@/components/ui";
import { isLive } from "@/lib/env";

export const metadata: Metadata = { title: "Accedi o registrati" };

export default async function LoginPage(props: PageProps<"/accedi">) {
  const sp = await props.searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/") ? sp.next : "/account";
  const error = typeof sp.errore === "string" ? sp.errore : null;

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-serif text-4xl text-sage-900">Bentornato</h1>
      <p className="mt-2 text-muted">Accedi o crea un account per prenotare e seguire i tuoi appuntamenti.</p>
      <div className="mt-8 space-y-4">
        {error && <Notice tone="error">Il link non è valido o è scaduto. Riprova.</Notice>}
        {isLive ? (
          <AuthForm next={next} />
        ) : (
          <Notice>
            Il sito è in <strong>modalità demo</strong>: per accedere collega Supabase copiando{" "}
            <code>apps/web/.env.example</code> in <code>apps/web/.env.local</code> (vedi docs/10-sviluppo.md).
          </Notice>
        )}
      </div>
    </div>
  );
}
