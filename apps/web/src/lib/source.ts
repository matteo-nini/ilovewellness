import "server-only";
import { demoSource, supabaseSource, type CatalogSource } from "@ilovewellness/core";
import { isLive } from "./env";
import { createPublicClient } from "./supabase/server";

/** Sorgente del catalogo lato server: Supabase se configurato, altrimenti dati demo. */
export function getCatalog(): CatalogSource {
  return isLive ? supabaseSource(createPublicClient()) : demoSource;
}
