import { ResultsMap } from "@/components/results-map";
import { ProviderCard } from "@/components/ui";
import type { ProviderListItem } from "@ilovewellness/core";

export function SearchResults({ results }: { results: ProviderListItem[] }) {
  if (!results.length) {
    return (
      <div className="rounded-2xl border border-dashed border-sand-200 bg-white p-10 text-center">
        <p className="font-serif text-xl text-sage-900">Nessun risultato</p>
        <p className="mt-2 text-muted">Prova ad allargare la zona o a togliere qualche filtro.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="grid content-start gap-5 sm:grid-cols-2">
        {results.map((s) => (
          <ProviderCard key={s.slug} item={s} />
        ))}
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ResultsMap results={results} />
      </div>
    </div>
  );
}
