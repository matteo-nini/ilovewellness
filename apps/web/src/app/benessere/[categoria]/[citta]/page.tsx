// Pagine SEO città × disciplina (requisito F-25), es. /benessere/yoga-meditazione/bologna
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchResults } from "@/components/search-results";
import { allCities, getCategory, getCity, rootCategories, searchProviders } from "@/lib/catalog";

export function generateStaticParams() {
  return rootCategories().flatMap((c) => allCities().map((city) => ({ categoria: c.slug, citta: city.slug })));
}

async function resolve(props: PageProps<"/benessere/[categoria]/[citta]">) {
  const { categoria, citta } = await props.params;
  const category = getCategory(categoria);
  const city = getCity(citta);
  if (!category || !city) notFound();
  return { category, city };
}

export async function generateMetadata(props: PageProps<"/benessere/[categoria]/[citta]">): Promise<Metadata> {
  const { category, city } = await resolve(props);
  return {
    title: `${category.name} a ${city.name}`,
    description: `Operatori e strutture di ${category.name.toLowerCase()} a ${city.name} e dintorni: verificati, con recensioni reali e prenotazione online.`,
  };
}

export default async function CategoryCityPage(props: PageProps<"/benessere/[categoria]/[citta]">) {
  const { category, city } = await resolve(props);
  const results = searchProviders({ category: category.slug, city: city.slug });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-4 text-sm text-muted" aria-label="Percorso">
        <Link href="/" className="hover:underline">Home</Link> › <span>{category.name}</span> › <span className="text-ink">{city.name}</span>
      </nav>
      <h1 className="font-serif text-4xl text-sage-900">
        {category.name} a {city.name}
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        {results.length
          ? `${results.length} tra operatori e strutture verificati entro 25 km da ${city.name}. Confronta recensioni e prezzi, scrivi al professionista e prenota online.`
          : `Non ci sono ancora operatori di ${category.name.toLowerCase()} vicino a ${city.name}. Stiamo arrivando!`}
      </p>
      <div className="mt-8">
        <SearchResults results={results} />
      </div>
    </div>
  );
}
