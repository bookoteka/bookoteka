// Strona główna - rout: /

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baza } from "../db/polaczenie";
import { gatunki, ksiazki, ksiazkiGatunki } from "../db/schemat";
import { eq } from "drizzle-orm";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
  const KOLORY_FORMATOW = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

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
      <h1 className="text-5xl font-bold text-indigo-900 mb-6">
        bookoteka
      </h1>
      <Link to="/tymczasowe">tymczasowe</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block">
            Przeczytane książki
          </span>
          <span className="text-3xl font-extrabold text-indigo-600">
            {iloscKsiazek}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block">
            Suma przeczytanych stron
          </span>
          <span className="text-3xl font-extrabold text-indigo-600">
            {sumaStron.toLocaleString("pl-PL")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[280px]">
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

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[280px]">
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
                  <Bar dataKey="ilosc" fill="#6366f1" radius={[4, 4, 0, 0]} />
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
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
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
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">
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
                  <td className="py-3.5 px-6 text-right space-x-2"><Link to={`/ksiazka/${ksiazka.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium text-xs">Pokaż</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}