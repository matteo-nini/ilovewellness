import type { Metadata } from "next";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { getCategory, getCity, type SearchFilters } from "@ilovewellness/core";
import { getCatalog } from "@/lib/source";

export const metadata: Metadata = { title: "Cerca" };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function SearchPage(props: PageProps<"/cerca">) {
  const sp = await props.searchParams;
  const maxPrice = Number(one(sp.prezzo_max));
  const filters: SearchFilters = {
    q: one(sp.q),
    category: one(sp.categoria),
    city: one(sp.citta),
    online: one(sp.online) === "1",
    verifiedOnly: one(sp.verificati) === "1",
    maxPrice: Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : undefined,
  };
  const results = await getCatalog().searchProviders(filters);
  const where = filters.city ? getCity(filters.city)?.name : undefined;
  const what = filters.category ? getCategory(filters.category)?.name : filters.q;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <SearchForm defaults={filters} compact />

      <form action="/cerca" method="get" className="mt-4 flex flex-wrap items-center gap-2 text-sm" aria-label="Filtri">
        {filters.q && <input type="hidden" name="q" value={filters.q} />}
        {filters.category && <input type="hidden" name="categoria" value={filters.category} />}
        {filters.city && <input type="hidden" name="citta" value={filters.city} />}
        <label className="flex items-center gap-2 rounded-full border border-sand-200 bg-white px-3 py-1.5">
          <input type="checkbox" name="online" value="1" defaultChecked={filters.online} /> Anche online
        </label>
        <label className="flex items-center gap-2 rounded-full border border-sand-200 bg-white px-3 py-1.5">
          <input type="checkbox" name="verificati" value="1" defaultChecked={filters.verifiedOnly} /> Solo verificati
        </label>
        <label className="flex items-center gap-2 rounded-full border border-sand-200 bg-white px-3 py-1.5">
          Prezzo max €
          <input type="number" name="prezzo_max" min={0} step={5} defaultValue={filters.maxPrice} className="w-16 bg-transparent outline-none" />
        </label>
        <button className="rounded-full bg-sage-700 px-4 py-1.5 font-medium text-white hover:bg-sage-900">Applica filtri</button>
      </form>

      <h1 className="mt-8 font-serif text-2xl text-sage-900">
        {results.length} {results.length === 1 ? "risultato" : "risultati"}
        {what && <> per «{what}»</>}
        {where && <> vicino a {where}</>}
      </h1>
      <p className="mb-6 mt-1 text-sm text-muted">
        Ordinati per distanza e valutazione. Nessun risultato è sponsorizzato.{" "}
        <span className="whitespace-nowrap">(Criteri di ranking pubblici: requisito P2B/DSA.)</span>
      </p>

      <SearchResults results={results} />
    </div>
  );
}
