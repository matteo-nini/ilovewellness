-- =============================================================================
-- ILoveWellness · bucket di Storage
--   public-media       foto profili, copertine, gallerie (lettura pubblica)
--   verification-docs  documenti di verifica operatori (privato: membri + admin)
-- Percorsi: <provider_id>/<nome-file>
-- Il blocco è condizionale per poter applicare le migrazioni anche su un
-- Postgres senza lo schema "storage" (test locali, vedi supabase/tests).
-- =============================================================================
do $$
begin
  if to_regclass('storage.buckets') is null then
    raise notice 'Schema storage assente: bucket non creati';
    return;
  end if;

  insert into storage.buckets (id, name, public)
  values ('public-media', 'public-media', true),
         ('verification-docs', 'verification-docs', false)
  on conflict (id) do nothing;

  execute $p$
    create policy "media: upload dei membri del provider" on storage.objects
      for insert to authenticated
      with check (bucket_id = 'public-media'
                  and public.is_provider_member(((storage.foldername(name))[1])::uuid))
  $p$;
  execute $p$
    create policy "media: modifica dei membri del provider" on storage.objects
      for update to authenticated
      using (bucket_id = 'public-media'
             and public.is_provider_member(((storage.foldername(name))[1])::uuid))
  $p$;
  execute $p$
    create policy "media: eliminazione dei membri del provider" on storage.objects
      for delete to authenticated
      using (bucket_id = 'public-media'
             and public.is_provider_member(((storage.foldername(name))[1])::uuid))
  $p$;
  execute $p$
    create policy "documenti: lettura membri e admin" on storage.objects
      for select to authenticated
      using (bucket_id = 'verification-docs'
             and (public.is_provider_member(((storage.foldername(name))[1])::uuid) or public.is_admin()))
  $p$;
  execute $p$
    create policy "documenti: upload membri" on storage.objects
      for insert to authenticated
      with check (bucket_id = 'verification-docs'
                  and public.is_provider_member(((storage.foldername(name))[1])::uuid))
  $p$;
end $$;
