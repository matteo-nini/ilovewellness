-- =============================================================================
-- Coordinate leggibili via API: PostgREST restituisce `geography` in formato
-- binario (EWKB). Due colonne calcolate rendono lat/lng disponibili a web e app.
-- =============================================================================
alter table public.locations
  add column lat double precision generated always as (extensions.st_y(geo::extensions.geometry)) stored,
  add column lng double precision generated always as (extensions.st_x(geo::extensions.geometry)) stored;
