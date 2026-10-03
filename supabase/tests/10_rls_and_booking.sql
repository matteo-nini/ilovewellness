-- Test di schema, RLS e flusso di prenotazione.
-- Eseguire con supabase/tests/run.sh (Postgres locale) — si interrompe al primo errore.
\set ON_ERROR_STOP 1
\set QUIET 1

-- helper: impersona un utente (come farebbe PostgREST con il JWT)
create or replace function pg_temp.login(p_sub text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p_sub, 'role', 'authenticated')::text, false);
end $$;

create or replace function pg_temp.logout() returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', '', false);
end $$;

create or replace function pg_temp.assert(p_ok boolean, p_msg text) returns void language plpgsql as $$
begin
  if p_ok is not true then raise exception 'FALLITO: %', p_msg; end if;
  raise notice 'ok - %', p_msg;
end $$;

-- data di test: lunedì della prossima settimana, 10:00 ora di Roma
create temp table t as
select ((date_trunc('week', now() + interval '7 days'))::date + time '10:00') at time zone 'Europe/Rome' as slot;
grant select on t to anon, authenticated;

-- ---------------------------------------------------------------- ospite (anon)
set role anon;
select pg_temp.logout();
select pg_temp.assert((select count(*) from providers) = 8, 'anon vede gli 8 provider verificati');
select pg_temp.assert((select count(*) from categories) > 10, 'anon vede le categorie');
select pg_temp.assert((select count(*) from availability_exceptions) = 0, 'anon non vede le eccezioni');
select pg_temp.assert((select round(lat::numeric, 3) = 44.510 and round(lng::numeric, 3) = 11.344 from locations where provider_id = 'b0000000-0000-0000-0000-000000000002'), 'lat/lng calcolate dalla geografia');
select pg_temp.assert(
  (select count(*) from search_providers(p_lat => 44.4949, p_lng => 11.3426, p_radius_km => 10)) = 5,
  'ricerca entro 10 km da Bologna centro: 5 risultati');
select pg_temp.assert(
  (select array_agg(slug order by slug) from search_providers(p_category => 'yoga-meditazione', p_lat => 44.4949, p_lng => 11.3426, p_radius_km => 80))
  = array['elena-rossi-mindfulness', 'montovolo-retreat', 'studio-yoga-prana-bologna'],
  'filtro categoria include le sottocategorie');
select pg_temp.assert(
  (select count(*) from search_providers(p_query => 'shiatsu')) = 1, 'ricerca testuale "shiatsu"');
select pg_temp.assert(
  (select count(*) from search_providers(p_online => true)) = 2, 'filtro servizi online');
select pg_temp.assert(
  (select category_names = array['Shiatsu'] and not instant_booking and not has_online
     from search_providers(p_query => 'shiatsu')),
  'la ricerca restituisce discipline e opzioni della card');
select pg_temp.assert(
  (select count(*) from search_providers(p_query => 'abhyanga')) = 1, 'la ricerca trova anche i nomi dei servizi');
select pg_temp.assert(
  (select count(*) from available_slots('e0000000-0000-0000-0000-000000000003', (select slot from t)::date, (select slot from t)::date + 6)) = 5 * 19,
  'shiatsu: 19 slot al giorno dal lunedì al venerdì');
select pg_temp.assert(
  exists (select 1 from available_slots('e0000000-0000-0000-0000-000000000003', (select slot from t)::date, (select slot from t)::date) where starts_at = (select slot from t)),
  'lo slot di test è disponibile');
reset role;

-- ---------------------------------------------------------------- cliente
set role authenticated;
select pg_temp.login('a0000000-0000-0000-0000-000000000002');

insert into bookings (client_id, service_id, starts_at, payment_mode, price_cents, service_name, cancellation_policy, ends_at)
values ('a0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003', (select slot from t),
        'on_site', 1, 'manomesso', 'flexible', (select slot from t) + interval '1 minute');

select pg_temp.assert(
  (select status = 'pending' and price_cents = 5500 and commission_cents = 660
          and ends_at = starts_at + interval '60 minutes' and service_name = 'Trattamento shiatsu'
          and cancellation_policy = 'moderate'
     from bookings where client_id = auth.uid()),
  'prenotazione su richiesta: stato, prezzo, commissione e durata calcolati dal server');

select pg_temp.assert(
  not exists (select 1 from available_slots('e0000000-0000-0000-0000-000000000003', (select slot from t)::date, (select slot from t)::date) where starts_at = (select slot from t)),
  'lo slot prenotato non è più disponibile');

do $$ begin
  insert into bookings (client_id, service_id, starts_at, price_cents, service_name, cancellation_policy, ends_at)
  values ('a0000000-0000-0000-0000-000000000016', 'e0000000-0000-0000-0000-000000000003', (select slot from t), 0, '', 'flexible', now());
  raise exception 'FALLITO: prenotazione a nome di altri accettata';
exception when others then
  if sqlerrm like 'FALLITO%' then raise; end if;
  raise notice 'ok - non si può prenotare a nome di altri';
end $$;

-- update diretto ignorato (nessuna policy di update)
update bookings set status = 'completed' where client_id = auth.uid();
select pg_temp.assert((select status from bookings where client_id = auth.uid()) = 'pending',
  'il cliente non può cambiare stato con un update diretto');

do $$ begin
  perform booking_transition((select id from bookings where client_id = auth.uid()), 'completed');
  raise exception 'FALLITO: il cliente ha completato la prenotazione';
exception when others then
  if sqlerrm like 'FALLITO%' then raise; end if;
  raise notice 'ok - il cliente non può segnare la prenotazione come completata';
end $$;

-- chat
insert into conversations (client_id, provider_id) values (auth.uid(), 'b0000000-0000-0000-0000-000000000002');
insert into messages (conversation_id, sender_id, body)
select id, auth.uid(), 'Buongiorno, è adatto anche a chi non l''ha mai provato?' from conversations where client_id = auth.uid();

-- profilo: niente auto-promozione ad admin
do $$ begin
  update profiles set is_admin = true where id = auth.uid();
  raise exception 'FALLITO: auto-promozione ad admin';
exception when others then
  if sqlerrm like 'FALLITO%' then raise; end if;
  raise notice 'ok - un utente non può diventare admin da solo';
end $$;
select pg_temp.assert((select count(*) from profiles) = 1, 'il cliente vede solo il proprio profilo');

-- un utente crea un provider: resta in bozza e non può auto-verificarsi
insert into providers (kind, slug, display_name, verification_status, commission_bps)
values ('individual', 'nuovo-operatore', 'Nuovo Operatore', 'verified', 0);
select pg_temp.assert(
  (select verification_status = 'draft' and commission_bps = 1200 from providers where slug = 'nuovo-operatore'),
  'il nuovo provider nasce in bozza con commissione standard');
select pg_temp.assert(
  exists (select 1 from provider_members m join providers p on p.id = m.provider_id
          where p.slug = 'nuovo-operatore' and m.user_id = auth.uid() and m.role = 'owner'),
  'chi crea il provider ne diventa owner');
do $$ begin
  update providers set verification_status = 'verified' where slug = 'nuovo-operatore';
  raise exception 'FALLITO: auto-verifica';
exception when others then
  if sqlerrm like 'FALLITO%' then raise; end if;
  raise notice 'ok - un operatore non può auto-verificarsi';
end $$;
reset role;

set role anon;
select pg_temp.logout();
select pg_temp.assert(not exists (select 1 from providers where slug = 'nuovo-operatore'),
  'i provider in bozza non sono pubblici');
reset role;

-- ---------------------------------------------------------------- operatore (Giulia)
set role authenticated;
select pg_temp.login('a0000000-0000-0000-0000-000000000012');
select pg_temp.assert((select count(*) from bookings) = 1, 'l''operatore vede la prenotazione ricevuta');
select pg_temp.assert((select count(*) from messages) = 1, 'l''operatore legge il messaggio');
select pg_temp.assert((select full_name from profiles where id = 'a0000000-0000-0000-0000-000000000002') = 'Chiara Esposito',
  'l''operatore vede il nome del cliente');
insert into messages (conversation_id, sender_id, body)
select id, auth.uid(), 'Certo! Ti aspetto.' from conversations;
select mark_conversation_read((select id from conversations));
select booking_transition((select id from bookings), 'confirmed');
select pg_temp.assert((select status from bookings) = 'confirmed', 'l''operatore conferma la prenotazione');
do $$ begin
  perform booking_transition((select id from bookings), 'completed');
  raise exception 'FALLITO: completata prima dell''orario';
exception when others then
  if sqlerrm like 'FALLITO%' then raise; end if;
  raise notice 'ok - non si può completare una prenotazione futura';
end $$;
reset role;

-- ---------------------------------------------------------------- terzo utente
set role authenticated;
select pg_temp.login('a0000000-0000-0000-0000-000000000016');
select pg_temp.assert((select count(*) from bookings) = 0, 'un estraneo non vede prenotazioni altrui');
select pg_temp.assert((select count(*) from messages) = 0, 'un estraneo non legge chat altrui');
reset role;

-- ---------------------------------------------------------------- recensioni
set role authenticated;
select pg_temp.login('a0000000-0000-0000-0000-000000000002');
do $$ begin
  insert into reviews (booking_id, provider_id, author_name, rating, body)
  select id, provider_id, 'x', 5, 'Bellissimo' from bookings;
  raise exception 'FALLITO: recensione prima della fine';
exception when others then
  if sqlerrm like 'FALLITO%' then raise; end if;
  raise notice 'ok - niente recensioni su prenotazioni non completate';
end $$;
reset role;

-- l'admin chiude la prenotazione (in produzione: operatore dopo l'orario)
set role authenticated;
select pg_temp.login('a0000000-0000-0000-0000-000000000001');
select booking_transition((select id from bookings where client_id = 'a0000000-0000-0000-0000-000000000002'), 'completed');
reset role;

set role authenticated;
select pg_temp.login('a0000000-0000-0000-0000-000000000002');
insert into reviews (booking_id, provider_id, author_name, rating, body)
select id, 'b0000000-0000-0000-0000-000000000001', 'Falso Nome', 5, 'Trattamento splendido, mi sono sentita accolta.' from bookings;
select pg_temp.assert(
  (select author_name = 'Chiara E.' and provider_id = 'b0000000-0000-0000-0000-000000000002' from reviews),
  'recensione verificata: autore e provider presi dalla prenotazione');
select pg_temp.assert(
  (select rating_avg = 5 and rating_count = 1 from providers where slug = 'giulia-neri-shiatsu'),
  'rating aggregato aggiornato');

reset role;

-- ---------------------------------------------------------------- integrità
do $$ begin
  insert into bookings (client_id, service_id, starts_at, ends_at, status, price_cents, service_name, cancellation_policy)
  values ('a0000000-0000-0000-0000-000000000016', 'e0000000-0000-0000-0000-000000000003',
          (select slot from t) + interval '1 day', (select slot from t) + interval '1 day 1 hour', 'confirmed', 0, '', 'flexible'),
         ('a0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003',
          (select slot from t) + interval '1 day 30 minutes', (select slot from t) + interval '1 day 90 minutes', 'confirmed', 0, '', 'flexible');
  raise exception 'FALLITO: sovrapposizione accettata';
exception when exclusion_violation then
  raise notice 'ok - il vincolo di esclusione impedisce doppie prenotazioni anche lato server';
end $$;

-- commissione azzerata per cliente abituale (inserimento come service role)
insert into bookings (client_id, service_id, starts_at, ends_at, price_cents, service_name, cancellation_policy)
values ('a0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003',
        (select slot from t) + interval '2 days', now(), 0, '', 'flexible');
select pg_temp.assert(
  (select commission_cents from bookings where starts_at = (select slot from t) + interval '2 days') = 0,
  'nessuna commissione sui clienti abituali');

\echo 'Tutti i test sono passati.'
