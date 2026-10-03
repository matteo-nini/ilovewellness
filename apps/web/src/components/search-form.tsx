import { allCities, rootCategories, type SearchFilters } from "@ilovewellness/core";

/** Barra di ricerca principale: semplice form GET, funziona anche senza JavaScript. */
export function SearchForm({ defaults = {}, compact = false }: { defaults?: SearchFilters; compact?: boolean }) {
  return (
    <form
      action="/cerca"
      method="get"
      role="search"
      className={`grid gap-2 rounded-3xl bg-white p-2 shadow-lg ring-1 ring-sand-200 ${compact ? "sm:grid-cols-[2fr_1.4fr_1.2fr_auto]" : "sm:grid-cols-[2fr_1.4fr_1.2fr_auto] sm:p-3"}`}
    >
      <label className="flex flex-col rounded-2xl px-4 py-2 hover:bg-sand-50">
        <span className="text-xs font-medium text-muted">Cosa cerchi?</span>
        <input name="q" defaultValue={defaults.q} placeholder="es. shiatsu, yoga, percorso termale" className="bg-transparent outline-none placeholder:text-muted/60" />
      </label>
      <label className="flex flex-col rounded-2xl px-4 py-2 hover:bg-sand-50">
        <span className="text-xs font-medium text-muted">Categoria</span>
        <select name="categoria" defaultValue={defaults.category ?? ""} className="bg-transparent outline-none">
          <option value="">Tutte</option>
          {rootCategories().map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col rounded-2xl px-4 py-2 hover:bg-sand-50">
        <span className="text-xs font-medium text-muted">Dove?</span>
        <select name="citta" defaultValue={defaults.city ?? ""} className="bg-transparent outline-none">
          <option value="">Ovunque</option>
          {allCities().map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="rounded-2xl bg-terra-500 px-6 py-3 font-medium text-white transition hover:bg-terra-600">
        Cerca
      </button>
    </form>
  );
}
