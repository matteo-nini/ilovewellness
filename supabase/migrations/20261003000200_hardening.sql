-- =============================================================================
-- Hardening suggerito dal Security Advisor di Supabase
-- =============================================================================

-- 1. search_path fisso anche per le funzioni trigger "invoker"
alter function public.set_updated_at()          set search_path = public;
alter function public.guard_profile_columns()   set search_path = public;
alter function public.guard_provider_columns()  set search_path = public;

-- 2. Le funzioni trigger non devono essere invocabili via API (/rest/v1/rpc/...).
--    I trigger scattano comunque: EXECUTE non viene verificato al momento dell'esecuzione.
revoke execute on function
  public.set_updated_at(),
  public.handle_new_user(),
  public.guard_profile_columns(),
  public.guard_provider_columns(),
  public.add_provider_owner(),
  public.prepare_booking(),
  public.prepare_review(),
  public.refresh_provider_rating(),
  public.touch_conversation()
from public, anon, authenticated;

-- Nota: restano volutamente eseguibili
--   * available_slots, search_providers (anon + authenticated): API pubbliche di ricerca
--   * is_admin, is_provider_member, provider_is_public, is_conversation_participant,
--     can_view_profile: usate dentro le policy RLS, che vengono valutate con i
--     permessi del ruolo chiamante. Rivelano solo informazioni sul chiamante stesso.
--   * booking_transition, reply_to_review, mark_conversation_read,
--     submit_provider_for_review, set_provider_verification: RPC che verificano
--     i permessi al loro interno.
