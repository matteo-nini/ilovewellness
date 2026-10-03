import Link from "next/link";
import { formatPrice, type ProviderListItem } from "@ilovewellness/core";

// Mappa schematica dei risultati (prototipo, senza servizio di mappe esterno).
// Nella versione completa: MapLibre/Mapbox con tile OpenStreetMap — vedi docs/03-architettura.md.
const W = 600;
const H = 380;

type Bounds = { minLat: number; maxLat: number; minLng: number; maxLng: number };

/** Inquadra i risultati con un margine, mantenendo le proporzioni del riquadro. */
function fitBounds(points: { lat: number; lng: number }[]): Bounds {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const cLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const cLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  // 1° di longitudine a ~44,5°N vale ~0,71° di latitudine
  const k = Math.cos((cLat * Math.PI) / 180);
  let spanLng = Math.max(Math.max(...lngs) - Math.min(...lngs), 0.06) * 1.5;
  let spanLat = Math.max(Math.max(...lats) - Math.min(...lats), 0.04) * 1.6;
  if (spanLng * k * H > spanLat * W) spanLat = (spanLng * k * H) / W;
  else spanLng = (spanLat * W) / (k * H);
  return { minLat: cLat - spanLat / 2, maxLat: cLat + spanLat / 2, minLng: cLng - spanLng / 2, maxLng: cLng + spanLng / 2 };
}

const projector = (b: Bounds) => (lat: number, lng: number) => ({
  x: ((lng - b.minLng) / (b.maxLng - b.minLng)) * W,
  y: (1 - (lat - b.minLat) / (b.maxLat - b.minLat)) * H,
});

const landmarks = [
  { name: "Bologna", lat: 44.4949, lng: 11.3426 },
  { name: "Imola", lat: 44.3533, lng: 11.7141 },
  { name: "Porretta Terme", lat: 44.155, lng: 10.977 },
];

export function ResultsMap({ results }: { results: ProviderListItem[] }) {
  const bounds = fitBounds(results);
  const project = projector(bounds);
  const visible = landmarks.filter(
    (l) => l.lat > bounds.minLat && l.lat < bounds.maxLat && l.lng > bounds.minLng && l.lng < bounds.maxLng,
  );
  return (
    <figure className="overflow-hidden rounded-2xl border border-sand-200 bg-sage-100">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Mappa schematica dei risultati">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#cfdccb" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
        {/* Via Emilia (Modena → Bologna → Imola → Faenza) */}
        <path
          d={[[44.647, 10.925], [44.4949, 11.3426], [44.3533, 11.7141], [44.285, 11.883]]
            .map(([lat, lng], i) => `${i ? "L" : "M"} ${project(lat, lng).x} ${project(lat, lng).y}`)
            .join(" ")}
          fill="none" stroke="#e9dcc5" strokeWidth="6" strokeLinecap="round"
        />
        {visible.map((l) => {
          const { x, y } = project(l.lat, l.lng);
          return (
            <text key={l.name} x={x + 8} y={y + 18} fontSize="13" fill="#5d6a59" fontStyle="italic">
              {l.name}
            </text>
          );
        })}
        {results.map((p) => {
          const { x, y } = project(p.lat, p.lng);
          return (
            <Link key={p.slug} href={`/operatori/${p.slug}`}>
              <g className="cursor-pointer" transform={`translate(${x}, ${y})`}>
                <title>{`${p.displayName} — da ${formatPrice(p.minPriceCents)}`}</title>
                <rect x={-30} y={-30} width={60} height={22} rx={11} fill="#fff" stroke="#c4704b" strokeWidth="1.5" />
                <text x={0} y={-15} fontSize="12" textAnchor="middle" fontWeight="600" fill="#1f2a1d">
                  {formatPrice(p.minPriceCents)}
                </text>
                <circle r={4} fill="#c4704b" />
              </g>
            </Link>
          );
        })}
      </svg>
      <figcaption className="px-4 py-2 text-xs text-muted">Mappa schematica · nella versione completa: mappa interattiva</figcaption>
    </figure>
  );
}
