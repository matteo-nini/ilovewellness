import { describe, expect, it } from "vitest";
import { demoSlots, groupSlotsByDay, romeParts, romeToIso, searchDemoProviders } from "./catalog";
import { demoProviders, slugify } from "./index";

describe("fuso orario di Roma", () => {
  it("converte l'ora locale in UTC con ora legale e solare", () => {
    expect(romeToIso("2026-07-15", "10:00")).toBe("2026-07-15T08:00:00.000Z"); // CEST, UTC+2
    expect(romeToIso("2026-12-15", "10:00")).toBe("2026-12-15T09:00:00.000Z"); // CET, UTC+1
  });
  it("legge data e ora a Roma", () => {
    expect(romeParts(new Date("2026-10-03T22:30:00Z"))).toEqual({ date: "2026-10-04", time: "00:30" });
  });
});

describe("slot", () => {
  const giulia = demoProviders.find((p) => p.slug === "giulia-neri-shiatsu")!;
  it("genera gli slot dalle regole settimanali rispettando il preavviso", () => {
    // sabato 3 ottobre 2026, ore 10 a Roma: sab/dom chiuso, lunedì 19 slot (09:00–18:00 ogni 30')
    const days = demoSlots(giulia, giulia.services[0], new Date("2026-10-03T08:00:00Z"), 3);
    expect(days.map((d) => d.slots.length)).toEqual([0, 0, 19]);
    expect(days[2].slots[0]).toBe("09:00");
  });
  it("raggruppa per giorno gli istanti della RPC", () => {
    const days = groupSlotsByDay(["2026-10-05T07:00:00Z", "2026-10-05T07:30:00Z", "2026-10-06T16:00:00Z"], "2026-10-05", 3);
    expect(days).toEqual([
      { date: "2026-10-05", slots: ["09:00", "09:30"] },
      { date: "2026-10-06", slots: ["18:00"] },
      { date: "2026-10-07", slots: [] },
    ]);
  });
});

describe("ricerca demo", () => {
  it("filtra per città e categoria (con sottocategorie)", () => {
    const r = searchDemoProviders({ city: "bologna", category: "yoga-meditazione" });
    expect(r.map((p) => p.slug)).toEqual(["studio-yoga-prana-bologna", "elena-rossi-mindfulness"]);
  });
  it("cerca anche nei nomi dei servizi, senza accenti", () => {
    expect(searchDemoProviders({ q: "abhyanga" }).map((p) => p.slug)).toEqual(["luca-bianchi-ayurveda"]);
  });
});

it("slugify", () => {
  expect(slugify("Terme & SPA dell'Appennino")).toBe("terme-spa-dell-appennino");
});
