// Strona główna - rout: /

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baza } from "../db/polaczenie";
import { gatunki, ksiazki, ksiazkiGatunki } from "../db/schemat";
import { eq } from "drizzle-orm";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DOSTEPNE_KOLORY } from "../types/kolory";

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
        setListaKsiazek(ksiazkiZPelnyDanymi);
      } catch (blad) {
        console.error("Błąd podczas pobierania książek:", blad);
      }
    }
    pobierzDane();
  }, []);

  const obecnyOdcien = getComputedStyle(document.documentElement)
    .getPropertyValue("--p-odcien")
    .trim();

  const aktywnyMotyw =
    DOSTEPNE_KOLORY.find((k) => k.odcien === obecnyOdcien) ||
    DOSTEPNE_KOLORY.find((k) => k.id === "indigo")!;

  const iloscKsiazek = listaKsiazek.length;
  const sumaStron = listaKsiazek.reduce(
    (suma, ksiazka) => suma + (ksiazka.strony || 0),
    0
  );

  const daneFormatyMap = listaKsiazek.reduce<Record<string, number>>((acc, ksiazka) => {
    const format = ksiazka.formatKsiazki || "Inny";
    acc[format] = (acc[format] || 0) + 1;
    return acc;
  }, {});
  const daneFormaty = Object.entries(daneFormatyMap).map(([nazwa, wartosc]) => ({
    nazwa,
    wartosc,
  }));
  const KOLORY_FORMATOW = aktywnyMotyw.koloryWykresu;

  const daneOcenyMap = listaKsiazek.reduce<Record<string, number>>((acc, ksiazka) => {
    const ocena = ksiazka.ocena || "Brak";
    acc[ocena] = (acc[ocena] || 0) + 1;
    return acc;
  }, {});
  const daneOceny = Object.entries(daneOcenyMap)
    .map(([ocena, ilosc]) => ({ ocena, ilosc }))
    .sort((a, b) => Number(a.ocena) - Number(b.ocena));

  return (
    <div style={{ padding: "1rem"}}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-5xl font-bold text-primary-900">
          bookoteka
        </h1>
        <Link 
          to="/ustawienia" 
          className="p-2 text-primary-900 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
          title="Ustawienia"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.75} 
            stroke="currentColor" 
            className="w-8 h-8"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block">
            Przeczytane książki
          </span>
          <span className="text-3xl font-extrabold text-primary-600">
            {iloscKsiazek}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block">
            Suma przeczytanych stron
          </span>
          <span className="text-3xl font-extrabold text-primary-600">
            {sumaStron.toLocaleString("pl-PL")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-70">
          <h3 className="text-base font-semibold text-slate-800 mb-3 text-center">
            Podział według formatów
          </h3>
          <div className="w-full h-52 flex items-center justify-center">
            {daneFormaty.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={daneFormaty}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="wartosc"
                    nameKey="nazwa"
                    label={({ nazwa, wartosc }: any) => `${nazwa}: ${wartosc}`}
                  >
                    {daneFormaty.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={KOLORY_FORMATOW[index % KOLORY_FORMATOW.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm italic">Brak danych do wyświetlenia</p>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-70">
          <h3 className="text-base font-semibold text-slate-800 mb-3 text-center">
            Rozkład ocen książek
          </h3>
          <div className="w-full h-52 flex items-center justify-center">
            {daneOceny.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daneOceny} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="ocena" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="ilosc" fill={aktywnyMotyw.kodHex} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm italic">Brak danych do wyświetlenia</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dodaj"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
          >
            Dodaj nową książkę
          </Link>
        </div>

        <Link
          to="/raporty"
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

      <div className="mt-10 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            Przeczytane książki
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-primary-800 rounded-full">
            Łącznie: {iloscKsiazek}
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
                  <td className="py-3.5 px-6 text-right space-x-2"><Link to={`/ksiazka/${ksiazka.id}`} className="text-primary-600 hover:text-primary-900 font-medium text-xs">Pokaż</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}