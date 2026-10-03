-- =============================================================================
-- ILoveWellness · schema iniziale (MVP)
-- -----------------------------------------------------------------------------
-- Marketplace del benessere: utenti, operatori/strutture, servizi, disponibilità,
-- prenotazioni, recensioni verificate, chat, verifica operatori, segnalazioni DSA.
--
-- Convenzioni
--   * importi in centesimi di euro (integer)
--   * orari in timestamptz; il fuso dell'operatore è in providers.timezone
--   * giorni della settimana ISO: 1 = lunedì … 7 = domenica
--   * ogni tabella ha Row Level Security attiva; le operazioni sensibili passano
--     da funzioni RPC (security definer) che verificano i permessi
-- Documentazione: docs/03-architettura.md
-- =============================================================================

create extension if not exists postgis    with schema extensions;
create extension if not exists btree_gist with schema extensions;

-- -----------------------------------------------------------------------------
-- Tipi enumerati
-- -----------------------------------------------------------------------------
create type public.provider_kind        as enum ('individual', 'venue');
create type public.verification_status  as enum ('draft', 'pending', 'verified', 'rejected', 'suspended');
create type public.member_role          as enum ('owner', 'staff');
create type public.service_mode         as enum ('in_person', 'online', 'at_home');
create type public.cancellation_policy  as enum ('flexible', 'moderate', 'strict');
create type public.payment_mode         as enum ('online', 'on_site');
create type public.booking_status       as enum (
  'awaiting_payment',      -- slot trattenuto in attesa del pagamento online
  'pending',               -- in attesa di conferma dell'operatore (prenotazione su richiesta)
  'confirmed',
  'cancelled_by_client',
  'cancelled_by_provider',
  'completed',
  'no_show',
  'disputed'
);
create type public.document_type        as enum ('identity', 'training', 'association', 'insurance', 'license', 'other');
create type public.document_status      as enum ('pending', 'approved', 'rejected');
create type public.review_status        as enum ('published', 'hidden');
create type public.report_target        as enum ('provider', 'review', 'message', 'user');
create type public.report_status        as enum ('open', 'actioned', 'dismissed');

-- -----------------------------------------------------------------------------
-- Utility
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- -----------------------------------------------------------------------------
-- Profili (estensione di auth.users)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  full_name         text not null default '',
  avatar_url        text,
  city              text,
  is_admin          boolean not null default false,
  marketing_consent boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
comment on table public.profiles is 'Dati pubblici/di servizio degli account. I dati di autenticazione restano in auth.users.';

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Crea il profilo alla registrazione
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- Un utente non amministratore non può promuoversi admin
create or replace function public.guard_profile_columns()
returns trigger language plpgsql as $$
begin
  if current_user in ('anon', 'authenticated') and not public.is_admin()
     and new.is_admin is distinct from old.is_admin then
    raise exception 'is_admin può essere modificato solo da un amministratore';
  end if;
  return new;
end $$;

create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_columns();

-- -----------------------------------------------------------------------------
-- Categorie / discipline (albero)
-- -----------------------------------------------------------------------------
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid references public.categories (id) on delete restrict,
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name        text not null,
  description text,
  icon        text,
  sort_order  integer not null default 0
);

-- -----------------------------------------------------------------------------
-- Provider: operatore individuale o struttura
-- -----------------------------------------------------------------------------
create table public.providers (
  id                  uuid primary key default gen_random_uuid(),
  kind                public.provider_kind not null,
  slug                text not null unique check (slug ~ '^[a-z0-9-]+$'),
  display_name        text not null,
  headline            text,
  bio                 text,
  cover_url           text,
  -- dati del professionista (DSA art. 30, DAC7)
  legal_name          text,
  vat_number          text,
  contact_email       text,
  contact_phone       text,
  -- impostazioni
  timezone            text not null default 'Europe/Rome',
  instant_booking     boolean not null default true,
  min_notice_hours    integer not null default 12 check (min_notice_hours >= 0),
  languages           text[] not null default array['it'],
  -- gestiti dalla piattaforma (protetti da trigger)
  verification_status public.verification_status not null default 'draft',
  verified_at         timestamptz,
  commission_bps      integer not null default 1200 check (commission_bps between 0 and 5000),
  stripe_account_id   text,
  rating_avg          numeric(3, 2) not null default 0,
  rating_count        integer not null default 0,
  created_by          uuid references public.profiles (id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  search_vector       tsvector generated always as (
    to_tsvector('italian', coalesce(display_name, '') || ' ' || coalesce(headline, '') || ' ' || coalesce(bio, ''))
  ) stored
);
comment on column public.providers.commission_bps is 'Commissione in punti base (1200 = 12%).';

create index providers_search_idx on public.providers using gin (search_vector);
create index providers_status_idx on public.providers (verification_status);

create trigger providers_updated_at before update on public.providers
  for each row execute function public.set_updated_at();

create table public.provider_members (
  provider_id uuid not null references public.providers (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  role        public.member_role not null default 'staff',
  created_at  timestamptz not null default now(),
  primary key (provider_id, user_id)
);
create index provider_members_user_idx on public.provider_members (user_id);

create or replace function public.is_provider_member(p_provider_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.provider_members
    where provider_id = p_provider_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_provider_owner(p_provider_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.provider_members
    where provider_id = p_provider_id and user_id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.provider_is_public(p_provider_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.providers where id = p_provider_id and verification_status = 'verified'
  );
$$;

-- Gli operatori non possono auto-verificarsi né toccare commissioni/rating/Stripe
create or replace function public.guard_provider_columns()
returns trigger language plpgsql as $$
begin
  if current_user in ('anon', 'authenticated') and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.verification_status := 'draft';
      new.verified_at         := null;
      new.commission_bps      := 1200;
      new.stripe_account_id   := null;
      new.rating_avg          := 0;
      new.rating_count        := 0;
      new.created_by          := auth.uid();
    elsif new.verification_status is distinct from old.verification_status
       or new.verified_at       is distinct from old.verified_at
       or new.commission_bps    is distinct from old.commission_bps
       or new.stripe_account_id is distinct from old.stripe_account_id
       or new.rating_avg        is distinct from old.rating_avg
       or new.rating_count      is distinct from old.rating_count then
      raise exception 'Campi gestiti dalla piattaforma: modifica non consentita';
    end if;
  end if;
  return new;
end $$;

create trigger providers_guard before insert or update on public.providers
  for each row execute function public.guard_provider_columns();

-- Chi crea un provider ne diventa owner
create or replace function public.add_provider_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.created_by is not null then
    insert into public.provider_members (provider_id, user_id, role)
    values (new.id, new.created_by, 'owner')
    on conflict do nothing;
  end if;
  return new;
end $$;

create trigger providers_add_owner after insert on public.providers
  for each row execute function public.add_provider_owner();

create table public.provider_categories (
  provider_id uuid not null references public.providers (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete restrict,
  primary key (provider_id, category_id)
);
create index provider_categories_category_idx on public.provider_categories (category_id);

-- -----------------------------------------------------------------------------
-- Sedi
-- -----------------------------------------------------------------------------
create table public.locations (
  id          uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers (id) on delete cascade,
  label       text,
  address     text not null,
  city        text not null,
  province    text,
  postal_code text,
  geo         extensions.geography(point, 4326) not null,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index locations_provider_idx on public.locations (provider_id);
create index locations_geo_idx on public.locations using gist (geo);
create index locations_city_idx on public.locations (lower(city));

-- -----------------------------------------------------------------------------
-- Servizi
-- -----------------------------------------------------------------------------
create table public.services (
  id                  uuid primary key default gen_random_uuid(),
  provider_id         uuid not null references public.providers (id) on delete cascade,
  location_id         uuid references public.locations (id) on delete set null,
  category_id         uuid references public.categories (id) on delete set null,
  name                text not null,
  description         text,
  duration_min        integer not null check (duration_min between 5 and 1440),
  slot_step_min       integer not null default 30 check (slot_step_min between 5 and 1440),
  price_cents         integer not null check (price_cents >= 0),
  mode                public.service_mode not null default 'in_person',
  capacity            integer not null default 1 check (capacity >= 1),
  cancellation_policy public.cancellation_policy not null default 'moderate',
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index services_provider_idx on public.services (provider_id);
create index services_category_idx on public.services (category_id);

create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Disponibilità
-- -----------------------------------------------------------------------------
create table public.availability_rules (
  id          uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers (id) on delete cascade,
  location_id uuid references public.locations (id) on delete cascade,
  service_id  uuid references public.services (id) on delete cascade,  -- null = vale per tutti i servizi
  weekday     smallint not null check (weekday between 1 and 7),
  start_time  time not null,
  end_time    time not null,
  check (end_time > start_time)
);
create index availability_rules_provider_idx on public.availability_rules (provider_id, weekday);

create table public.availability_exceptions (
  id          uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers (id) on delete cascade,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  reason      text,
  check (ends_at > starts_at)
);
create index availability_exceptions_provider_idx on public.availability_exceptions (provider_id, starts_at);

-- -----------------------------------------------------------------------------
-- Prenotazioni
-- -----------------------------------------------------------------------------
create table public.bookings (
  id                       uuid primary key default gen_random_uuid(),
  client_id                uuid not null references public.profiles (id) on delete restrict,
  provider_id              uuid not null references public.providers (id) on delete restrict,
  service_id               uuid not null references public.services (id) on delete restrict,
  location_id              uuid references public.locations (id) on delete set null,
  starts_at                timestamptz not null,
  ends_at                  timestamptz not null,
  during                   tstzrange generated always as (tstzrange(starts_at, ends_at, '[)')) stored,
  status                   public.booking_status not null default 'pending',
  -- true se la prenotazione occupa in esclusiva l'agenda dell'operatore
  exclusive                boolean not null default true,
  -- valori congelati al momento della prenotazione
  service_name             text not null,
  price_cents              integer not null check (price_cents >= 0),
  commission_cents         integer not null default 0 check (commission_cents >= 0),
  currency                 char(3) not null default 'EUR',
  payment_mode             public.payment_mode not null default 'online',
  cancellation_policy      public.cancellation_policy not null,
  stripe_payment_intent_id text,
  client_note              text,
  cancellation_reason      text,
  cancelled_at             timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  check (ends_at > starts_at),
  -- nessuna doppia prenotazione per lo stesso operatore (servizi individuali)
  constraint bookings_no_overlap exclude using gist (
    provider_id with =,
    during with &&
  ) where (exclusive and status in ('awaiting_payment', 'pending', 'confirmed'))
);
create index bookings_client_idx on public.bookings (client_id, starts_at desc);
create index bookings_provider_idx on public.bookings (provider_id, starts_at);
create index bookings_service_idx on public.bookings (service_id, starts_at);

create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

-- Slot prenotabili per un servizio tra due date (incluse, max 62 giorni).
-- Considera: regole settimanali, eccezioni, preavviso minimo, prenotazioni
-- esistenti (esclusive o capienza per le classi di gruppo).
create or replace function public.available_slots(p_service_id uuid, p_from date, p_to date)
returns table (starts_at timestamptz, ends_at timestamptz)
language sql stable security definer set search_path = public, extensions as $$
  with svc as (
    select s.id, s.provider_id, s.location_id, s.duration_min, s.slot_step_min, s.capacity,
           p.timezone, p.min_notice_hours, (s.capacity = 1 and p.kind = 'individual') as exclusive
    from public.services s
    join public.providers p on p.id = s.provider_id
    where s.id = p_service_id and s.is_active and p.verification_status = 'verified'
  ),
  days as (
    select d::date as day
    from generate_series(p_from::timestamp, least(p_to, p_from + 61)::timestamp, interval '1 day') d
  ),
  candidates as (
    select (t at time zone svc.timezone)                                                as starts_at,
           (t at time zone svc.timezone) + make_interval(mins => svc.duration_min)     as ends_at
    from svc
    join public.availability_rules r
      on r.provider_id = svc.provider_id
     and (r.location_id is null or svc.location_id is null or r.location_id = svc.location_id)
     and (r.service_id is null or r.service_id = svc.id)
    join days on extract(isodow from days.day) = r.weekday
    cross join lateral generate_series(
      days.day + r.start_time,
      days.day + r.end_time - make_interval(mins => svc.duration_min),
      make_interval(mins => svc.slot_step_min)
    ) t
  )
  select distinct c.starts_at, c.ends_at
  from candidates c, svc
  where c.starts_at >= now() + make_interval(hours => svc.min_notice_hours)
    and not exists (
      select 1 from public.availability_exceptions e
      where e.provider_id = svc.provider_id
        and tstzrange(e.starts_at, e.ends_at, '[)') && tstzrange(c.starts_at, c.ends_at, '[)')
    )
    and (
      case when svc.exclusive then
        not exists (
          select 1 from public.bookings b
          where b.provider_id = svc.provider_id
            and b.exclusive
            and b.status in ('awaiting_payment', 'pending', 'confirmed')
            and b.during && tstzrange(c.starts_at, c.ends_at, '[)')
        )
      else
        (select count(*) from public.bookings b
          where b.service_id = svc.id
            and b.starts_at = c.starts_at
            and b.status in ('awaiting_payment', 'pending', 'confirmed')) < svc.capacity
      end
    )
  order by c.starts_at;
$$;

-- Validazione e valori calcolati all'inserimento di una prenotazione
create or replace function public.prepare_booking()
returns trigger language plpgsql security definer set search_path = public, extensions as $$
declare
  v_service  public.services%rowtype;
  v_provider public.providers%rowtype;
  v_returning boolean;
begin
  select * into v_service from public.services where id = new.service_id;
  if not found or not v_service.is_active then
    raise exception 'Servizio non disponibile';
  end if;
  select * into v_provider from public.providers where id = v_service.provider_id;

  if current_user in ('anon', 'authenticated') then
    if new.client_id is distinct from auth.uid() then
      raise exception 'Puoi prenotare solo per te stesso';
    end if;
    if not exists (
      select 1 from public.available_slots(
        new.service_id,
        (new.starts_at at time zone v_provider.timezone)::date,
        (new.starts_at at time zone v_provider.timezone)::date
      ) s where s.starts_at = new.starts_at
    ) then
      raise exception 'Lo slot scelto non è disponibile';
    end if;
  end if;

  new.provider_id         := v_service.provider_id;
  new.location_id         := coalesce(new.location_id, v_service.location_id);
  new.ends_at             := new.starts_at + make_interval(mins => v_service.duration_min);
  new.exclusive           := (v_service.capacity = 1 and v_provider.kind = 'individual');
  new.service_name        := v_service.name;
  new.price_cents         := v_service.price_cents;
  new.cancellation_policy := v_service.cancellation_policy;

  -- Commissione solo sui clienti nuovi per il provider (vedi docs/01 §6)
  select exists (
    select 1 from public.bookings b
    where b.client_id = new.client_id and b.provider_id = new.provider_id and b.status = 'completed'
  ) into v_returning;
  new.commission_cents := case when v_returning then 0
                               else round(v_service.price_cents * v_provider.commission_bps / 10000.0)::integer end;

  if current_user in ('anon', 'authenticated') then
    new.stripe_payment_intent_id := null;
    new.cancelled_at := null;
    new.status := case
      when new.payment_mode = 'online' then 'awaiting_payment'
      when v_provider.instant_booking  then 'confirmed'
      else 'pending'
    end;
  end if;
  return new;
end $$;

create trigger bookings_prepare before insert on public.bookings
  for each row execute function public.prepare_booking();

-- Cambi di stato consentiti (unico modo per client/operatori di modificare una prenotazione).
-- Il passaggio awaiting_payment → pending/confirmed avviene dal webhook Stripe (service role).
create or replace function public.booking_transition(
  p_booking_id uuid,
  p_status     public.booking_status,
  p_reason     text default null
) returns public.bookings
language plpgsql security definer set search_path = public as $$
declare
  b         public.bookings%rowtype;
  is_client boolean;
  is_member boolean;
  allowed   boolean := false;
begin
  select * into b from public.bookings where id = p_booking_id for update;
  if not found then
    raise exception 'Prenotazione inesistente';
  end if;

  is_client := b.client_id = auth.uid();
  is_member := public.is_provider_member(b.provider_id);

  if public.is_admin() then
    allowed := true;
  elsif is_client then
    allowed := p_status = 'cancelled_by_client'
               and b.status in ('awaiting_payment', 'pending', 'confirmed');
  elsif is_member then
    allowed := (b.status = 'pending' and p_status in ('confirmed', 'cancelled_by_provider'))
            or (b.status = 'confirmed' and p_status = 'cancelled_by_provider')
            or (b.status = 'confirmed' and p_status in ('completed', 'no_show') and b.starts_at <= now());
  end if;

  if not allowed then
    raise exception 'Transizione % → % non consentita', b.status, p_status;
  end if;

  update public.bookings
     set status = p_status,
         cancellation_reason = case when p_status in ('cancelled_by_client', 'cancelled_by_provider')
                                    then p_reason else cancellation_reason end,
         cancelled_at = case when p_status in ('cancelled_by_client', 'cancelled_by_provider')
                             then now() else cancelled_at end
   where id = p_booking_id
   returning * into b;
  return b;
end $$;

-- -----------------------------------------------------------------------------
-- Recensioni verificate
-- -----------------------------------------------------------------------------
create table public.reviews (
  id                  uuid primary key default gen_random_uuid(),
  booking_id          uuid not null unique references public.bookings (id) on delete cascade,
  provider_id         uuid not null references public.providers (id) on delete cascade,
  author_id           uuid references public.profiles (id) on delete set null,
  author_name         text not null,             -- es. "Giulia M." (snapshot, privacy-friendly)
  rating              smallint not null check (rating between 1 and 5),
  body                text check (char_length(body) <= 3000),
  provider_reply      text check (char_length(provider_reply) <= 2000),
  provider_replied_at timestamptz,
  status              public.review_status not null default 'published',
  created_at          timestamptz not null default now()
);
create index reviews_provider_idx on public.reviews (provider_id, created_at desc);

create or replace function public.prepare_review()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  b public.bookings%rowtype;
  v_name text;
begin
  select * into b from public.bookings where id = new.booking_id;
  if not found or b.status <> 'completed' then
    raise exception 'Si può recensire solo una prenotazione completata';
  end if;
  if current_user in ('anon', 'authenticated') and b.client_id is distinct from auth.uid() then
    raise exception 'Solo il cliente può recensire la propria prenotazione';
  end if;
  select full_name into v_name from public.profiles where id = b.client_id;
  new.author_id   := b.client_id;
  new.provider_id := b.provider_id;
  new.author_name := coalesce(nullif(
    split_part(trim(v_name), ' ', 1) ||
    coalesce(' ' || nullif(left(split_part(trim(v_name), ' ', 2), 1), '') || '.', ''), ''), 'Utente');
  if current_user in ('anon', 'authenticated') then
    new.status := 'published';
    new.provider_reply := null;
    new.provider_replied_at := null;
  end if;
  return new;
end $$;

create trigger reviews_prepare before insert on public.reviews
  for each row execute function public.prepare_review();

create or replace function public.refresh_provider_rating()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_provider uuid := coalesce(new.provider_id, old.provider_id);
begin
  update public.providers p
     set rating_avg   = coalesce((select round(avg(rating)::numeric, 2) from public.reviews
                                  where provider_id = v_provider and status = 'published'), 0),
         rating_count = (select count(*) from public.reviews
                          where provider_id = v_provider and status = 'published')
   where p.id = v_provider;
  return null;
end $$;

create trigger reviews_refresh_rating after insert or update or delete on public.reviews
  for each row execute function public.refresh_provider_rating();

create or replace function public.reply_to_review(p_review_id uuid, p_reply text)
returns public.reviews language plpgsql security definer set search_path = public as $$
declare
  r public.reviews%rowtype;
begin
  select * into r from public.reviews where id = p_review_id;
  if not found or not (public.is_provider_member(r.provider_id) or public.is_admin()) then
    raise exception 'Non autorizzato';
  end if;
  update public.reviews
     set provider_reply = p_reply, provider_replied_at = now()
   where id = p_review_id
   returning * into r;
  return r;
end $$;

-- -----------------------------------------------------------------------------
-- Chat
-- -----------------------------------------------------------------------------
create table public.conversations (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references public.profiles (id) on delete cascade,
  provider_id     uuid not null references public.providers (id) on delete cascade,
  last_message_at timestamptz,
  created_at      timestamptz not null default now(),
  unique (client_id, provider_id)
);
create index conversations_provider_idx on public.conversations (provider_id, last_message_at desc);

create or replace function public.is_conversation_participant(p_conversation_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.conversations c
    where c.id = p_conversation_id
      and (c.client_id = auth.uid() or public.is_provider_member(c.provider_id))
  );
$$;

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id       uuid not null references public.profiles (id) on delete cascade,
  body            text not null check (char_length(body) between 1 and 5000),
  attachment_path text,
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);
create index messages_conversation_idx on public.messages (conversation_id, created_at);

create or replace function public.touch_conversation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  return null;
end $$;

create trigger messages_touch_conversation after insert on public.messages
  for each row execute function public.touch_conversation();

create or replace function public.mark_conversation_read(p_conversation_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_conversation_participant(p_conversation_id) then
    raise exception 'Non autorizzato';
  end if;
  update public.messages
     set read_at = now()
   where conversation_id = p_conversation_id and sender_id <> auth.uid() and read_at is null;
end $$;

-- -----------------------------------------------------------------------------
-- Preferiti, verifica, segnalazioni
-- -----------------------------------------------------------------------------
create table public.favorites (
  user_id     uuid not null references public.profiles (id) on delete cascade,
  provider_id uuid not null references public.providers (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, provider_id)
);

create table public.verification_documents (
  id           uuid primary key default gen_random_uuid(),
  provider_id  uuid not null references public.providers (id) on delete cascade,
  doc_type     public.document_type not null,
  storage_path text not null,           -- bucket privato "verification-docs"
  status       public.document_status not null default 'pending',
  expires_on   date,
  notes        text,
  reviewed_by  uuid references public.profiles (id) on delete set null,
  reviewed_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index verification_documents_provider_idx on public.verification_documents (provider_id);

create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles (id) on delete set null,
  target_type public.report_target not null,
  target_id   uuid not null,
  reason      text not null,
  details     text,
  status      public.report_status not null default 'open',
  resolved_by uuid references public.profiles (id) on delete set null,
  resolved_at timestamptz,
  created_at  timestamptz not null default now()
);
create index reports_status_idx on public.reports (status, created_at);

-- L'operatore invia il profilo in verifica (draft/rejected → pending)
create or replace function public.submit_provider_for_review(p_provider_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_provider_owner(p_provider_id) then
    raise exception 'Non autorizzato';
  end if;
  update public.providers
     set verification_status = 'pending'
   where id = p_provider_id and verification_status in ('draft', 'rejected');
end $$;

-- L'admin approva/respinge/sospende
create or replace function public.set_provider_verification(
  p_provider_id uuid, p_status public.verification_status
) returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Solo amministratori';
  end if;
  update public.providers
     set verification_status = p_status,
         verified_at = case when p_status = 'verified' then now() else verified_at end
   where id = p_provider_id;
end $$;

-- -----------------------------------------------------------------------------
-- Visibilità dei profili: proprio, admin, o controparte di prenotazione/chat
-- -----------------------------------------------------------------------------
create or replace function public.can_view_profile(p_profile_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select p_profile_id = auth.uid()
      or public.is_admin()
      or exists (select 1 from public.bookings b
                 where b.client_id = p_profile_id and public.is_provider_member(b.provider_id))
      or exists (select 1 from public.conversations c
                 where c.client_id = p_profile_id and public.is_provider_member(c.provider_id));
$$;

-- -----------------------------------------------------------------------------
-- Ricerca pubblica dei provider
-- -----------------------------------------------------------------------------
create or replace function public.search_providers(
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
         p.rating_avg, p.rating_count,
         loc.city,
         st_y(loc.geo::geometry), st_x(loc.geo::geometry),
         case when o.g is not null then round((st_distance(loc.geo, o.g) / 1000)::numeric, 1)::float8 end,
         prices.min_price
  from public.providers p
  cross join origin o
  left join lateral (
    select l.* from public.locations l
    where l.provider_id = p.id
    order by l.is_primary desc, (case when o.g is not null then st_distance(l.geo, o.g) end) nulls last
    limit 1
  ) loc on true
  left join lateral (
    select min(s.price_cents)::integer as min_price
    from public.services s where s.provider_id = p.id and s.is_active
  ) prices on true
  where p.verification_status = 'verified'
    and (p_query is null or p.search_vector @@ websearch_to_tsquery('italian', p_query))
    and (p_category is null or exists (
          select 1 from public.provider_categories pc where pc.provider_id = p.id and pc.category_id in (select id from cat)))
    and (o.g is null or exists (
          select 1 from public.locations l where l.provider_id = p.id and st_dwithin(l.geo, o.g, p_radius_km * 1000))
         or (p_online is true and exists (
          select 1 from public.services s where s.provider_id = p.id and s.is_active and s.mode = 'online')))
    and (p_online is null or p_online is false or exists (
          select 1 from public.services s where s.provider_id = p.id and s.is_active and s.mode = 'online'))
    and (p_max_price is null or prices.min_price <= p_max_price)
  order by
    case when o.g is not null then st_distance(loc.geo, o.g) end nulls last,
    p.rating_avg desc, p.rating_count desc
  limit least(p_limit, 100) offset p_offset;
$$;

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.profiles                enable row level security;
alter table public.categories              enable row level security;
alter table public.providers               enable row level security;
alter table public.provider_members        enable row level security;
alter table public.provider_categories     enable row level security;
alter table public.locations               enable row level security;
alter table public.services                enable row level security;
alter table public.availability_rules      enable row level security;
alter table public.availability_exceptions enable row level security;
alter table public.bookings                enable row level security;
alter table public.reviews                 enable row level security;
alter table public.conversations           enable row level security;
alter table public.messages                enable row level security;
alter table public.favorites               enable row level security;
alter table public.verification_documents  enable row level security;
alter table public.reports                 enable row level security;

-- profiles
create policy "profili: lettura consentita" on public.profiles
  for select using (public.can_view_profile(id));
create policy "profili: modifica del proprio" on public.profiles
  for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

-- categories
create policy "categorie: lettura pubblica" on public.categories
  for select using (true);
create policy "categorie: gestione admin" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- providers
create policy "provider: verificati pubblici, altrimenti membri/admin" on public.providers
  for select using (verification_status = 'verified' or public.is_provider_member(id) or public.is_admin());
create policy "provider: creazione da utenti registrati" on public.providers
  for insert to authenticated with check (true);
create policy "provider: modifica da membri" on public.providers
  for update using (public.is_provider_member(id) or public.is_admin())
  with check (public.is_provider_member(id) or public.is_admin());
create policy "provider: eliminazione admin" on public.providers
  for delete using (public.is_admin());

-- provider_members
create policy "membri: visibili ai membri" on public.provider_members
  for select using (user_id = auth.uid() or public.is_provider_member(provider_id) or public.is_admin());
create policy "membri: gestione owner" on public.provider_members
  for insert with check (public.is_provider_owner(provider_id) or public.is_admin());
create policy "membri: rimozione owner" on public.provider_members
  for delete using (public.is_provider_owner(provider_id) or public.is_admin());

-- tabelle di catalogo del provider: lettura se il provider è pubblico, scrittura ai membri
create policy "discipline provider: lettura" on public.provider_categories
  for select using (public.provider_is_public(provider_id) or public.is_provider_member(provider_id) or public.is_admin());
create policy "discipline provider: scrittura" on public.provider_categories
  for all using (public.is_provider_member(provider_id) or public.is_admin())
  with check (public.is_provider_member(provider_id) or public.is_admin());

create policy "sedi: lettura" on public.locations
  for select using (public.provider_is_public(provider_id) or public.is_provider_member(provider_id) or public.is_admin());
create policy "sedi: scrittura" on public.locations
  for all using (public.is_provider_member(provider_id) or public.is_admin())
  with check (public.is_provider_member(provider_id) or public.is_admin());

create policy "servizi: lettura" on public.services
  for select using (public.provider_is_public(provider_id) or public.is_provider_member(provider_id) or public.is_admin());
create policy "servizi: scrittura" on public.services
  for all using (public.is_provider_member(provider_id) or public.is_admin())
  with check (public.is_provider_member(provider_id) or public.is_admin());

create policy "disponibilità: lettura" on public.availability_rules
  for select using (public.provider_is_public(provider_id) or public.is_provider_member(provider_id) or public.is_admin());
create policy "disponibilità: scrittura" on public.availability_rules
  for all using (public.is_provider_member(provider_id) or public.is_admin())
  with check (public.is_provider_member(provider_id) or public.is_admin());

-- le eccezioni (es. "ferie", "visita medica") sono private: il pubblico vede solo gli slot liberi
create policy "eccezioni: solo membri" on public.availability_exceptions
  for all using (public.is_provider_member(provider_id) or public.is_admin())
  with check (public.is_provider_member(provider_id) or public.is_admin());

-- bookings: nessuna policy di UPDATE/DELETE → si modificano solo via booking_transition()
create policy "prenotazioni: lettura parti coinvolte" on public.bookings
  for select using (client_id = auth.uid() or public.is_provider_member(provider_id) or public.is_admin());
create policy "prenotazioni: creazione dal cliente" on public.bookings
  for insert to authenticated with check (client_id = auth.uid());

-- reviews
create policy "recensioni: pubblicate visibili a tutti" on public.reviews
  for select using (status = 'published' or author_id = auth.uid()
                    or public.is_provider_member(provider_id) or public.is_admin());
create policy "recensioni: creazione dal cliente" on public.reviews
  for insert to authenticated with check (true);   -- validata da prepare_review()
create policy "recensioni: moderazione admin" on public.reviews
  for update using (public.is_admin()) with check (public.is_admin());

-- conversations & messages
create policy "conversazioni: partecipanti" on public.conversations
  for select using (client_id = auth.uid() or public.is_provider_member(provider_id) or public.is_admin());
create policy "conversazioni: avvio dal cliente" on public.conversations
  for insert to authenticated with check (client_id = auth.uid() and public.provider_is_public(provider_id));

create policy "messaggi: lettura partecipanti" on public.messages
  for select using (public.is_conversation_participant(conversation_id) or public.is_admin());
create policy "messaggi: invio partecipanti" on public.messages
  for insert to authenticated with check (sender_id = auth.uid() and public.is_conversation_participant(conversation_id));

-- favorites
create policy "preferiti: propri" on public.favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- verification_documents
create policy "documenti: membri e admin" on public.verification_documents
  for select using (public.is_provider_member(provider_id) or public.is_admin());
create policy "documenti: caricamento membri" on public.verification_documents
  for insert to authenticated with check (public.is_provider_member(provider_id) and status = 'pending');
create policy "documenti: revisione admin" on public.verification_documents
  for update using (public.is_admin()) with check (public.is_admin());

-- reports
create policy "segnalazioni: invio" on public.reports
  for insert to authenticated with check (reporter_id = auth.uid() and status = 'open');
create policy "segnalazioni: lettura proprie o admin" on public.reports
  for select using (reporter_id = auth.uid() or public.is_admin());
create policy "segnalazioni: gestione admin" on public.reports
  for update using (public.is_admin()) with check (public.is_admin());

-- Funzioni esposte via API (le altre restano interne)
revoke execute on all functions in schema public from public, anon;
grant execute on function
  public.available_slots(uuid, date, date),
  public.search_providers(text, text, float8, float8, float8, boolean, integer, integer, integer)
  to anon, authenticated;
grant execute on function
  public.booking_transition(uuid, public.booking_status, text),
  public.reply_to_review(uuid, text),
  public.mark_conversation_read(uuid),
  public.submit_provider_for_review(uuid),
  public.set_provider_verification(uuid, public.verification_status),
  public.is_admin(), public.is_provider_member(uuid), public.is_provider_owner(uuid),
  public.provider_is_public(uuid), public.is_conversation_participant(uuid), public.can_view_profile(uuid)
  to authenticated;
-- le funzioni helper usate dalle policy devono essere eseguibili anche da anon
grant execute on function
  public.is_admin(), public.is_provider_member(uuid), public.provider_is_public(uuid),
  public.is_conversation_participant(uuid), public.can_view_profile(uuid)
  to anon;
