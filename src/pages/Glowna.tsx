// Strona główna - rout: /

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baza } from "../db/polaczenie";
import { gatunki, ksiazki, ksiazkiGatunki } from "../db/schemat";
import { eq } from "drizzle-orm";

interface KsiazkaZGatunkami {
  id: number;
  tytul: string | null;
  autor: string | null;
  formatKsiazki: string | null;
  jednotomowka: boolean | null;
  nazwaSerii: string | null;
  ocena: string | null;
  przeczytanoW: string | null;
  strony: number | null;
  listaGatunkow: string[];
}

export default function Glowna() {
  const [listaKsiazek, setListaKsiazek] = useState<KsiazkaZGatunkami[]>([]);
  useEffect(() => {
    async function pobierzDane() {
      try {
        const pobraneKsiazki = await baza.select().from(ksiazki);

        const ksiazkiZPelnyDanymi = await Promise.all(
          pobraneKsiazki.map(async (ksiazka) => {
            const powiazaneGatunki = await baza
              .select({ nazwa: gatunki.nazwa })
              .from(ksiazkiGatunki)
              .innerJoin(gatunki, eq(ksiazkiGatunki.gatunekId, gatunki.id))
              .where(eq(ksiazkiGatunki.ksiazkaId, ksiazka.id));
            return {
              ...ksiazka,
              listaGatunkow: powiazaneGatunki.map((g) => g.nazwa),
            };
          })
        );
        setListaKsiazek(ksiazkiZPelnyDanymi); // tu jest błąd
      } catch (blad) {
        console.error("Błąd podczas pobierania książek:", blad);
      }
    }
    pobierzDane();
  }, []);
  return (
    <div style={{ padding: "1rem"}}>
      <h1 className="text-5xl font-bold text-indigo-900 mb-6">
        bookoteka
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block">
            Przeczytane książki
          </span>
          <span className="text-3xl font-extrabold text-indigo-600">
            {/* Miejsce na liczbę książek */}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block">
            Suma przeczytanych stron
          </span>
          <span className="text-3xl font-extrabold text-indigo-600">
            {/* Miejsce na sumę stron */}
            0
          </span>
        </div>
      </div>

      {/* Wykresy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-semibold text-slate-800 mb-3 text-center">
            Podział według formatów
          </h3>
          {/* Miejsce na wykres formatów */}
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-semibold text-slate-800 mb-3 text-center">
            Rozkład ocen książek
          </h3>
          {/* Miejsce na wykres ocen */}
        </div>
      </div>

      {/* Przyciski akcji */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dodaj"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
          >
            Dodaj nową książkę
          </Link>
        </div>

        <Link
          to="/podsumowania"
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Podsumowania i Raporty
        </Link>
      </div>

      {/* Książki */}
      <div className="mt-10 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            Przeczytane książki
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">
            Łącznie: {/* Miejsce na łączną liczbę */}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/30">
                <th className="py-3 px-6 font-semibold">Tytuł</th>
                <th className="py-3 px-6 font-semibold">Autor</th>
                <th className="py-3 px-6 font-semibold">Seria</th>
                <th className="py-3 px-6 font-semibold">Format</th>
                <th className="py-3 px-6 font-semibold">Ocena</th>
                <th className="py-3 px-6 font-semibold">Gatunki</th>
                <th className="py-3 px-6 font-semibold">Strony</th>
                <th className="py-3 px-6 font-semibold text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listaKsiazek.map((ksiazka) => (
                <tr key={ksiazka.id}>
                  <td className="py-3.5 px-6 text-slate-600 capitalize">{ksiazka.tytul}</td>
                  <td className="py-3.5 px-6 text-slate-600">{ksiazka.autor}</td>
                  <td className="py-3.5 px-6 text-slate-600">{ksiazka.jednotomowka ? "" : ksiazka.nazwaSerii}</td>
                  <td className="py-3.5 px-6 text-slate-600">{ksiazka.formatKsiazki}</td>
                  <td className="py-3.5 px-6 text-slate-600">{ksiazka.ocena}</td>
                  <td className="py-3.5 px-6 text-slate-600">{ksiazka.listaGatunkow.join(", ")}</td>
                  <td className="py-3.5 px-6 text-slate-600">{ksiazka.strony}</td>
                  <td className="py-3.5 px-6 text-right space-x-2">{/* tu wstawię link do strony książki */}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}