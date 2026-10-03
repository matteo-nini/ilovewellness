-- =============================================================================
-- Dati di esempio per sviluppo locale (Supabase CLI: `supabase db reset`).
-- Persone, strutture e indirizzi sono FITTIZI. Area pilota: Bologna e Appennino.
-- Gli stessi esempi sono usati dal prototipo web (apps/web/src/lib/demo-data.ts).
-- =============================================================================

-- Categorie --------------------------------------------------------------------
insert into public.categories (id, parent_id, slug, name, icon, sort_order) values
  ('c0000000-0000-0000-0000-000000000001', null, 'yoga-meditazione',       'Yoga e meditazione',        'lotus',   1),
  ('c0000000-0000-0000-0000-000000000002', null, 'massaggi-trattamenti',   'Massaggi e trattamenti',    'hands',   2),
  ('c0000000-0000-0000-0000-000000000003', null, 'spa-terme',              'SPA e terme',               'water',   3),
  ('c0000000-0000-0000-0000-000000000004', null, 'naturopatia-consulenze', 'Naturopatia e consulenze',  'leaf',    4),
  ('c0000000-0000-0000-0000-000000000005', null, 'ritiri-eventi',          'Ritiri ed eventi',          'mountain',5),
  ('c0000000-0000-0000-0000-000000000101', 'c0000000-0000-0000-0000-000000000001', 'yoga',                  'Yoga',                    null, 1),
  ('c0000000-0000-0000-0000-000000000102', 'c0000000-0000-0000-0000-000000000001', 'meditazione-mindfulness','Meditazione e mindfulness', null, 2),
  ('c0000000-0000-0000-0000-000000000201', 'c0000000-0000-0000-0000-000000000002', 'shiatsu',               'Shiatsu',                 null, 1),
  ('c0000000-0000-0000-0000-000000000202', 'c0000000-0000-0000-0000-000000000002', 'massaggio-ayurvedico',  'Massaggio ayurvedico',    null, 2),
  ('c0000000-0000-0000-0000-000000000203', 'c0000000-0000-0000-0000-000000000002', 'reiki',                 'Reiki',                   null, 3),
  ('c0000000-0000-0000-0000-000000000204', 'c0000000-0000-0000-0000-000000000002', 'riflessologia',         'Riflessologia plantare',  null, 4),
  ('c0000000-0000-0000-0000-000000000301', 'c0000000-0000-0000-0000-000000000003', 'day-spa',               'Day spa',                 null, 1),
  ('c0000000-0000-0000-0000-000000000302', 'c0000000-0000-0000-0000-000000000003', 'terme',                 'Terme',                   null, 2),
  ('c0000000-0000-0000-0000-000000000401', 'c0000000-0000-0000-0000-000000000004', 'naturopatia',           'Naturopatia',             null, 1),
  ('c0000000-0000-0000-0000-000000000501', 'c0000000-0000-0000-0000-000000000005', 'ritiri',                'Ritiri',                  null, 1);

-- Utenti demo ------------------------------------------------------------------
insert into auth.users (id, email, raw_user_meta_data) values
  ('a0000000-0000-0000-0000-000000000001', 'admin@ilovewellness.test',  '{"full_name":"Admin ILoveWellness"}'),
  ('a0000000-0000-0000-0000-000000000002', 'cliente@ilovewellness.test','{"full_name":"Chiara Esposito"}'),
  ('a0000000-0000-0000-0000-000000000011', 'prana@ilovewellness.test',  '{"full_name":"Anna Galli"}'),
  ('a0000000-0000-0000-0000-000000000012', 'giulia@ilovewellness.test', '{"full_name":"Giulia Neri"}'),
  ('a0000000-0000-0000-0000-000000000013', 'terme@ilovewellness.test',  '{"full_name":"Paolo Venturi"}'),
  ('a0000000-0000-0000-0000-000000000014', 'marco@ilovewellness.test',  '{"full_name":"Marco Ferri"}'),
  ('a0000000-0000-0000-0000-000000000015', 'retreat@ilovewellness.test','{"full_name":"Laura Monti"}'),
  ('a0000000-0000-0000-0000-000000000016', 'elena@ilovewellness.test',  '{"full_name":"Elena Rossi"}'),
  ('a0000000-0000-0000-0000-000000000017', 'luca@ilovewellness.test',   '{"full_name":"Luca Bianchi"}'),
  ('a0000000-0000-0000-0000-000000000018', 'sara@ilovewellness.test',   '{"full_name":"Sara Conti"}');

update public.profiles set is_admin = true where id = 'a0000000-0000-0000-0000-000000000001';

-- Provider ---------------------------------------------------------------------
insert into public.providers
  (id, kind, slug, display_name, headline, bio, instant_booking, verification_status, verified_at, created_by)
values
  ('b0000000-0000-0000-0000-000000000001', 'venue', 'studio-yoga-prana-bologna', 'Studio Yoga Prana',
   'Hatha e Vinyasa yoga nel cuore di Bologna',
   'Uno studio luminoso a due passi da Santo Stefano. Classi per tutti i livelli, lezioni private e percorsi di respirazione.',
   true, 'verified', now(), 'a0000000-0000-0000-0000-000000000011'),
  ('b0000000-0000-0000-0000-000000000002', 'individual', 'giulia-neri-shiatsu', 'Giulia Neri',
   'Operatrice shiatsu diplomata, 10 anni di esperienza',
   'Trattamenti shiatsu per ritrovare equilibrio e rilassamento. Iscritta ad associazione professionale di categoria (L. 4/2013).',
   false, 'verified', now(), 'a0000000-0000-0000-0000-000000000012'),
  ('b0000000-0000-0000-0000-000000000003', 'venue', 'terme-spa-appennino', 'Terme & SPA Appennino',
   'Percorsi termali e massaggi tra i boschi dell''Appennino',
   'Piscine termali, sauna finlandese, bagno turco e area relax con vista. Massaggi singoli e di coppia.',
   true, 'verified', now(), 'a0000000-0000-0000-0000-000000000013'),
  ('b0000000-0000-0000-0000-000000000004', 'individual', 'marco-ferri-naturopata', 'Marco Ferri',
   'Naturopata · consulenze in studio e online',
   'Percorsi di benessere naturale su stile di vita, alimentazione consapevole e gestione dello stress. Le consulenze non sostituiscono il parere medico.',
   true, 'verified', now(), 'a0000000-0000-0000-0000-000000000014'),
  ('b0000000-0000-0000-0000-000000000005', 'venue', 'montovolo-retreat', 'Montovolo Retreat',
   'Giornate di yoga e meditazione nella natura',
   'Casa per ritiri sull''Appennino bolognese: giornate e weekend di yoga, meditazione e camminate consapevoli.',
   true, 'verified', now(), 'a0000000-0000-0000-0000-000000000015'),
  ('b0000000-0000-0000-0000-000000000006', 'individual', 'elena-rossi-mindfulness', 'Elena Rossi',
   'Insegnante di meditazione e mindfulness',
   'Sessioni individuali e percorsi di mindfulness per la gestione dello stress quotidiano, in studio o online.',
   true, 'verified', now(), 'a0000000-0000-0000-0000-000000000016'),
  ('b0000000-0000-0000-0000-000000000007', 'individual', 'luca-bianchi-ayurveda', 'Luca Bianchi',
   'Massaggio ayurvedico tradizionale',
   'Massaggi Abhyanga e Padabhyanga con oli caldi, secondo la tradizione ayurvedica appresa in Kerala.',
   true, 'verified', now(), 'a0000000-0000-0000-0000-000000000017'),
  ('b0000000-0000-0000-0000-000000000008', 'individual', 'sara-conti-reiki-imola', 'Sara Conti',
   'Reiki e riflessologia plantare a Imola',
   'Trattamenti di riequilibrio energetico e riflessologia plantare in un ambiente raccolto. Disponibile anche a domicilio.',
   false, 'verified', now(), 'a0000000-0000-0000-0000-000000000018');

insert into public.provider_categories (provider_id, category_id) values
  ('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000101'),
  ('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000102'),
  ('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000201'),
  ('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000301'),
  ('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000302'),
  ('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000401'),
  ('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000501'),
  ('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000101'),
  ('b0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000102'),
  ('b0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000202'),
  ('b0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000203'),
  ('b0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000204');

-- Sedi (coordinate approssimative, indirizzi fittizi) -----------------------------
insert into public.locations (id, provider_id, label, address, city, province, postal_code, geo, is_primary) values
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Studio', 'Via Santo Stefano 10', 'Bologna', 'BO', '40125',
   extensions.st_setsrid(extensions.st_makepoint(11.3487, 44.4910), 4326)::extensions.geography, true),
  ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Studio', 'Via di Corticella 20', 'Bologna', 'BO', '40128',
   extensions.st_setsrid(extensions.st_makepoint(11.3440, 44.5100), 4326)::extensions.geography, true),
  ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Terme', 'Via delle Terme 1', 'Porretta Terme', 'BO', '40046',
   extensions.st_setsrid(extensions.st_makepoint(10.9770, 44.1550), 4326)::extensions.geography, true),
  ('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'Studio', 'Via Porrettana 50', 'Casalecchio di Reno', 'BO', '40033',
   extensions.st_setsrid(extensions.st_makepoint(11.2770, 44.4760), 4326)::extensions.geography, true),
  ('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'Casa ritiri', 'Località Montovolo', 'Camugnano', 'BO', '40032',
   extensions.st_setsrid(extensions.st_makepoint(11.0890, 44.2200), 4326)::extensions.geography, true),
  ('d0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Studio', 'Via Murri 30', 'Bologna', 'BO', '40137',
   extensions.st_setsrid(extensions.st_makepoint(11.3650, 44.4830), 4326)::extensions.geography, true),
  ('d0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000007', 'Studio', 'Via San Donato 40', 'Bologna', 'BO', '40127',
   extensions.st_setsrid(extensions.st_makepoint(11.3750, 44.5050), 4326)::extensions.geography, true),
  ('d0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000008', 'Studio', 'Via Emilia 100', 'Imola', 'BO', '40026',
   extensions.st_setsrid(extensions.st_makepoint(11.7140, 44.3530), 4326)::extensions.geography, true);

-- Servizi ---------------------------------------------------------------------
insert into public.services
  (id, provider_id, location_id, category_id, name, description, duration_min, slot_step_min, price_cents, mode, capacity, cancellation_policy)
values
  ('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000101',
   'Classe di Hatha yoga', 'Classe di gruppo per tutti i livelli. Tappetini disponibili.', 75, 75, 1500, 'in_person', 12, 'flexible'),
  ('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000101',
   'Lezione privata di yoga', 'Lezione individuale personalizzata.', 60, 60, 5000, 'in_person', 1, 'moderate'),
  ('e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000201',
   'Trattamento shiatsu', 'Trattamento completo su futon, abbigliamento comodo.', 60, 30, 5500, 'in_person', 1, 'moderate'),
  ('e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000302',
   'Percorso termale (3 ore)', 'Accesso a piscine termali, sauna, bagno turco e area relax. Accappatoio incluso.', 180, 60, 4500, 'in_person', 20, 'flexible'),
  ('e0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000301',
   'Massaggio di coppia', 'Massaggio rilassante in cabina doppia.', 50, 60, 12000, 'in_person', 1, 'strict'),
  ('e0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000401',
   'Primo colloquio naturopatico', 'Incontro conoscitivo su stile di vita e obiettivi di benessere.', 60, 60, 6000, 'in_person', 1, 'moderate'),
  ('e0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000004', null, 'c0000000-0000-0000-0000-000000000401',
   'Consulenza online', 'Videochiamata di approfondimento.', 45, 45, 4500, 'online', 1, 'flexible'),
  ('e0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000501',
   'Giornata di yoga e meditazione', 'Pratica mattutina, pranzo vegetariano, camminata meditativa e pratica serale.', 420, 420, 8000, 'in_person', 15, 'strict'),
  ('e0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000102',
   'Sessione individuale di mindfulness', 'Pratiche guidate e strumenti per la vita quotidiana.', 60, 60, 3500, 'in_person', 1, 'flexible'),
  ('e0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000006', null, 'c0000000-0000-0000-0000-000000000102',
   'Meditazione guidata online', 'Sessione individuale in videochiamata.', 45, 45, 2500, 'online', 1, 'flexible'),
  ('e0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000202',
   'Massaggio Abhyanga', 'Massaggio completo con oli caldi.', 75, 15, 7000, 'in_person', 1, 'moderate'),
  ('e0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000202',
   'Padabhyanga (piedi)', 'Trattamento dei piedi con coppetta di bronzo.', 40, 20, 3500, 'in_person', 1, 'moderate'),
  ('e0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000203',
   'Trattamento Reiki', 'Trattamento completo, sdraiati e vestiti.', 60, 60, 4000, 'in_person', 1, 'flexible'),
  ('e0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000008', null, 'c0000000-0000-0000-0000-000000000204',
   'Riflessologia plantare a domicilio', 'Trattamento a casa tua (Imola e 10 km).', 50, 60, 5000, 'at_home', 1, 'moderate');

-- Disponibilità -----------------------------------------------------------------
insert into public.availability_rules (provider_id, service_id, weekday, start_time, end_time)
select 'b0000000-0000-0000-0000-000000000001'::uuid, 'e0000000-0000-0000-0000-000000000001'::uuid, d, '18:30'::time, '19:45'::time from unnest(array[1,3,5]) d
union all
select 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', d, '09:00', '13:00' from unnest(array[2,4]) d
union all
select 'b0000000-0000-0000-0000-000000000002', null, d, '09:00', '19:00' from generate_series(1,5) d
union all
select 'b0000000-0000-0000-0000-000000000003', null, d, '10:00', '22:00' from generate_series(1,7) d
union all
select 'b0000000-0000-0000-0000-000000000004', null, d, '14:00', '20:00' from unnest(array[1,2,4]) d
union all
select 'b0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000008', d, '09:00', '16:00' from unnest(array[6,7]) d
union all
select 'b0000000-0000-0000-0000-000000000006', null, d, '08:00', '12:00' from generate_series(1,6) d
union all
select 'b0000000-0000-0000-0000-000000000007', null, d, '10:00', '20:00' from generate_series(2,6) d
union all
select 'b0000000-0000-0000-0000-000000000008', null, d, '15:00', '20:00' from unnest(array[1,3,5]) d;
