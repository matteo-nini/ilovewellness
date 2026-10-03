import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-serif text-5xl text-sage-900">Respira.</p>
      <p className="mt-4 text-muted">La pagina che cerchi non esiste, ma c&apos;è tanto benessere da scoprire.</p>
      <Link href="/cerca" className="mt-8 inline-block rounded-full bg-terra-500 px-6 py-3 font-medium text-white hover:bg-terra-600">
        Torna alla ricerca
      </Link>
    </div>
  );
}
