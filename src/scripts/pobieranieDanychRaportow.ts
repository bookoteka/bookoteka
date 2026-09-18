// Pobieranie danych do generowania podsumowań

import { eq, gte, lte, and } from "drizzle-orm";
import { baza } from "../db/polaczenie";
import { ksiazki, ksiazkiGatunki, gatunki } from "../db/schemat";
import {
  DaneRaportuMiesiac,
  DaneRaportuRok,
  KsiazkaRaportu,
  StatystykiGatunku,
} from "../types/raporty";

const NAZWY_MIESIACY: Record<number, string> = {
  1: "Styczeń",
  2: "Luty",
  3: "Marzec",
  4: "Kwiecień",
  5: "Maj",
  6: "Czerwiec",
  7: "Lipiec",
  8: "Sierpień",
  9: "Wrzesień",
  10: "Październik",
  11: "Listopad",
  12: "Grudzień",
};

function parsujOcene(ocenaTekst: string | number): number {
  if (typeof ocenaTekst === "number") return ocenaTekst;
  const dopasowanie = ocenaTekst.match(/(\d+)/);
  return dopasowanie ? parseInt(dopasowanie[1], 10) : 0;
}

function mapujFormat(formatTekst: string): "papier" | "ebook" | "audiobook" | "synchrobook" {
  const formatNiski = formatTekst.toLowerCase();
  if (formatNiski.includes("papier")) return "papier";
  if (formatNiski.includes("e-book") || formatNiski.includes("ebook")) return "ebook";
  if (formatNiski.includes("audiobook")) return "audiobook";
  if (formatNiski.includes("synchrobook")) return "synchrobook";
  return "papier";
}

export async function pobierzDaneMiesiac(
  rok: number,
  miesiac: number
): Promise<DaneRaportuMiesiac> {
  const dataPoczatkowa = new Date(rok, miesiac - 1, 1).toISOString();
  const dataKoncowa = new Date(rok, miesiac, 0, 23, 59, 59).toISOString();

  // Pobranie książek wraz z ich gatunkami
  const pobraneKsiazki = await baza
    .select({
      id: ksiazki.id,
      tytul: ksiazki.tytul,
      autor: ksiazki.autor,
      seria: ksiazki.nazwaSerii,
      format: ksiazki.formatKsiazki,
      ocena: ksiazki.ocena,
      strony: ksiazki.strony,
      przeczytanoW: ksiazki.przeczytanoW,
      gatunekNazwa: gatunki.nazwa,
    })
    .from(ksiazki)
    .leftJoin(ksiazkiGatunki, eq(ksiazki.id, ksiazkiGatunki.ksiazkaId))
    .leftJoin(gatunki, eq(ksiazkiGatunki.gatunekId, gatunki.id))
    .where(
      and(
        gte(ksiazki.przeczytanoW, dataPoczatkowa),
        lte(ksiazki.przeczytanoW, dataKoncowa)
      )
    );

  const mapaKsiazek = new Map<number, any>();
  
  for (const rekord of pobraneKsiazki) {
    if (!mapaKsiazek.has(rekord.id)) {
      mapaKsiazek.set(rekord.id, {
        ...rekord,
        listaGatunkow: rekord.gatunekNazwa ? [rekord.gatunekNazwa] : [],
      });
    } else if (rekord.gatunekNazwa) {
      mapaKsiazek.get(rekord.id).listaGatunkow.push(rekord.gatunekNazwa);
    }
  }

  const unikalneKsiazki = Array.from(mapaKsiazek.values());

  let przeczytaneStrony = 0;
  const licznikFormatow = { papier: 0, ebook: 0, audiobook: 0, synchrobook: 0 };
  const licznikOcen: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const zliczenieGatunkow: Record<string, number> = {};

  const listaKsiazekRaport: KsiazkaRaportu[] = unikalneKsiazki.map((k, indeks) => {
    przeczytaneStrony += k.strony || 0;

    const kluczFormatu = mapujFormat(k.format);
    licznikFormatow[kluczFormatu]++;

    const ocenaLiczba = parsujOcene(k.ocena);
    if (ocenaLiczba >= 1 && ocenaLiczba <= 6) {
      licznikOcen[ocenaLiczba]++;
    }

    for (const g of k.listaGatunkow) {
      zliczenieGatunkow[g] = (zliczenieGatunkow[g] || 0) + 1;
    }

    return {
      lp: indeks + 1,
      tytul: k.tytul,
      autor: k.autor,
      seria: k.seria || undefined,
      format: k.format,
      ocena: `${ocenaLiczba}/6 ⭐️`,
      gatunki: k.listaGatunkow.join(", ") || "-",
      strony: k.strony || 0,
    };
  });

  // Sortowanie gatunków wg popularności
  const listaGatunkowRaport: StatystykiGatunku[] = Object.entries(zliczenieGatunkow)
    .map(([gatunek, liczba]) => ({ gatunek, liczba }))
    .sort((a, b) => b.liczba - a.liczba);

  const nazwaMiesiaca = NAZWY_MIESIACY[miesiac] || "Miesiąc";

  return {
    naglowek: `${nazwaMiesiaca} ${rok}`,
    przeczytaneKsiazki: unikalneKsiazki.length,
    przeczytaneStrony,
    formaty: licznikFormatow,
    oceny: licznikOcen,
    gatunki: listaGatunkowRaport,
    ksiazki: listaKsiazekRaport,
  };
}

export async function pobierzDaneRok(rok: number): Promise<DaneRaportuRok> {
  const dataPoczatkowa = new Date(rok, 0, 1).toISOString();
  const dataKoncowa = new Date(rok, 11, 31, 23, 59, 59).toISOString();

  const pobraneKsiazki = await baza
    .select({
      id: ksiazki.id,
      tytul: ksiazki.tytul,
      autor: ksiazki.autor,
      seria: ksiazki.nazwaSerii,
      format: ksiazki.formatKsiazki,
      ocena: ksiazki.ocena,
      strony: ksiazki.strony,
      przeczytanoW: ksiazki.przeczytanoW,
      gatunekNazwa: gatunki.nazwa,
    })
    .from(ksiazki)
    .leftJoin(ksiazkiGatunki, eq(ksiazki.id, ksiazkiGatunki.ksiazkaId))
    .leftJoin(gatunki, eq(ksiazkiGatunki.gatunekId, gatunki.id))
    .where(
      and(
        gte(ksiazki.przeczytanoW, dataPoczatkowa),
        lte(ksiazki.przeczytanoW, dataKoncowa)
      )
    );

  const mapaKsiazek = new Map<number, any>();
  
  for (const rekord of pobraneKsiazki) {
    if (!mapaKsiazek.has(rekord.id)) {
      mapaKsiazek.set(rekord.id, {
        ...rekord,
        listaGatunkow: rekord.gatunekNazwa ? [rekord.gatunekNazwa] : [],
      });
    } else if (rekord.gatunekNazwa) {
      mapaKsiazek.get(rekord.id).listaGatunkow.push(rekord.gatunekNazwa);
    }
  }

  const unikalneKsiazki = Array.from(mapaKsiazek.values());

  let przeczytaneStrony = 0;
  const licznikFormatow = { papier: 0, ebook: 0, audiobook: 0, synchrobook: 0 };
  const licznikOcen: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const zliczenieGatunkow: Record<string, number> = {};

  const listaKsiazekRaport: KsiazkaRaportu[] = unikalneKsiazki.map((k, indeks) => {
    przeczytaneStrony += k.strony || 0;

    const kluczFormatu = mapujFormat(k.format);
    licznikFormatow[kluczFormatu]++;

    const ocenaLiczba = parsujOcene(k.ocena);
    if (ocenaLiczba >= 1 && ocenaLiczba <= 6) {
      licznikOcen[ocenaLiczba]++;
    }

    for (const g of k.listaGatunkow) {
      zliczenieGatunkow[g] = (zliczenieGatunkow[g] || 0) + 1;
    }

    const dataPrzeczytania = new Date(k.przeczytanoW);
    const numerMiesiaca = dataPrzeczytania.getMonth() + 1;
    const miesiacNazwa = NAZWY_MIESIACY[numerMiesiaca] || "-";

    return {
      lp: indeks + 1,
      tytul: k.tytul,
      autor: k.autor,
      seria: k.seria || undefined,
      format: k.format,
      ocena: `${ocenaLiczba}/6 ⭐️`,
      gatunki: k.listaGatunkow.join(", ") || "-",
      miesiac: miesiacNazwa,
      strony: k.strony || 0,
    };
  });

  const listaGatunkowRaport: StatystykiGatunku[] = Object.entries(zliczenieGatunkow)
    .map(([gatunek, liczba]) => ({ gatunek, liczba }))
    .sort((a, b) => b.liczba - a.liczba);

  return {
    naglowek: `Rok ${rok}`,
    rok: `${rok}`,
    przeczytaneKsiazki: unikalneKsiazki.length,
    przeczytaneStrony,
    formaty: licznikFormatow,
    oceny: licznikOcen,
    gatunki: listaGatunkowRaport,
    ksiazki: listaKsiazekRaport,
  };
}