-- =============================================================================
-- search_providers: restituisce anche i dati che servono alle card dei risultati
-- (discipline, prenotazione immediata, servizi online), così web e app non
-- devono fare richieste aggiuntive per ogni risultato.
-- Cambiando il tipo di ritorno la funzione va ricreata: la versione precedente
-- viene rinominata (search_providers_v1) e resa non invocabile, così la
-- migrazione non contiene operazioni distruttive. Si potrà eliminarla in seguito.
-- =============================================================================
alter function public.search_providers(text, text, float8, float8, float8, boolean, integer, integer, integer)
  rename to search_providers_v1;
revoke execute on function public.search_providers_v1(text, text, float8, float8, float8, boolean, integer, integer, integer)
  from public, anon, authenticated;

create function public.search_providers(
  p_query     text    default null,
  p_category  text    default null,   -- slug; include le sottocategorie
  p_lat       float8  default null,
  p_lng       float8  default null,
  p_radius_km float8  default 25,
  p_online    boolean default null,
  p_max_price integer default null,   -- centesimi
  p_limit     integer default 20,
  p_offset    integer default 0
) returns table (
  id               uuid,
  slug             text,
  kind             public.provider_kind,
  display_name     text,
  headline         text,
  cover_url        text,
  rating_avg       numeric,
  rating_count     integer,
  instant_booking  boolean,
  has_online       boolean,
  category_names   text[],
  city             text,
  lat              float8,
  lng              float8,
  distance_km      float8,
  min_price_cents  integer
)
language sql stable security definer set search_path = public, extensions as $$
  with recursive cat as (
    select c.id from public.categories c where c.slug = p_category
    union all
    select c.id from public.categories c join cat on c.parent_id = cat.id
  ),
  origin as (
    select case when p_lat is not null and p_lng is not null
                then st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography end as g
  )
  select p.id, p.slug, p.kind, p.display_name, p.headline, p.cover_url,
         p.rating_avg, p.rating_count, p.instant_booking,
         svc.has_online,
         coalesce((select array_agg(c.name order by c.sort_order)
                     from public.provider_categories pc join public.categories c on c.id = pc.category_id
                    where pc.provider_id = p.id), '{}'),
         loc.city,
         st_y(loc.geo::geometry), st_x(loc.geo::geometry),
         case when o.g is not null then round((st_distance(loc.geo, o.g) / 1000)::numeric, 1)::float8 end,
         svc.min_price
  from public.providers p
  cross join origin o
  left join lateral (
    select l.* from public.locations l
    where l.provider_id = p.id
    order by l.is_primary desc, (case when o.g is not null then st_distance(l.geo, o.g) end) nulls last
    limit 1
  ) loc on true
  left join lateral (
    select min(s.price_cents)::integer as min_price,
           coalesce(bool_or(s.mode = 'online'), false) as has_online
    from public.services s where s.provider_id = p.id and s.is_active
  ) svc on true
  where p.verification_status = 'verified'
    and (p_query is null or p.search_vector @@ websearch_to_tsquery('italian', p_query)
         or exists (select 1 from public.services s
                     where s.provider_id = p.id and s.is_active and s.name ilike '%' || p_query || '%')
         or exists (select 1 from public.provider_categories pc join public.categories c on c.id = pc.category_id
                     where pc.provider_id = p.id and c.name ilike '%' || p_query || '%'))
    and (p_category is null or exists (
          select 1 from public.provider_categories pc where pc.provider_id = p.id and pc.category_id in (select id from cat)))
    and (o.g is null or exists (
          select 1 from public.locations l where l.provider_id = p.id and st_dwithin(l.geo, o.g, p_radius_km * 1000))
         or (p_online is true and svc.has_online))
    and (p_online is not true or svc.has_online)
    and (p_max_price is null or svc.min_price <= p_max_price)
  order by
    case when o.g is not null then st_distance(loc.geo, o.g) end nulls last,
    p.rating_avg desc, p.rating_count desc
  limit least(p_limit, 100) offset p_offset;
$$;

revoke execute on function public.search_providers(text, text, float8, float8, float8, boolean, integer, integer, integer) from public;
grant execute on function public.search_providers(text, text, float8, float8, float8, boolean, integer, integer, integer) to anon, authenticated;
