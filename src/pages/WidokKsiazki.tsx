// Widok książki - rout: /ksiazka/:id

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { eq, InferSelectModel } from "drizzle-orm";
import { gatunki, ksiazki, ksiazkiGatunki } from "../db/schemat";
import { baza } from "../db/polaczenie";

type KsiazkaTyp = InferSelectModel<typeof ksiazki>;

const MIESIACE = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

export default function WidokKsiazki() {
  const { id } = useParams<{ id: string }>();

  const [ksiazka, setKsiazka] = useState<KsiazkaTyp | null>(null);
  const [listaGatunkow, setListaGatunkow] = useState<string[]>([]);
  const [ladowanie, setLadowanie] = useState<boolean>(true);

  useEffect(() => {
    async function pobierzDane() {
      if (!id) return;

      try {
        const idLiczba = Number(id);

        const wynikKsiazka = await baza
          .select()
          .from(ksiazki)
          .where(eq(ksiazki.id, idLiczba));

        const wynikGatunki = await baza
          .select({ nazwa: gatunki.nazwa })
          .from(ksiazkiGatunki)
          .innerJoin(gatunki, eq(ksiazkiGatunki.gatunekId, gatunki.id))
          .where(eq(ksiazkiGatunki.ksiazkaId, idLiczba));

        if (wynikKsiazka.length > 0) {
          setKsiazka(wynikKsiazka[0]);
        }
        setListaGatunkow(wynikGatunki.map((g) => g.nazwa));
      } catch (err) {
        console.error("Błąd podczas pobierania książki:", err);
      } finally {
        setLadowanie(false);
      }
    }
    pobierzDane();
  }, [id]);

  if (ladowanie) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500 font-medium">Ładowanie danych...</p>
      </div>
    );
  }

  if (!ksiazka) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-600 text-lg font-medium">Nie znaleziono takiej książki.</p>
        <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm">
          Powrót do listy
        </Link>
      </div>
    );
  }

  // Formatowanie daty z pola przeczytanoW
  const dataObiekt = ksiazka.przeczytanoW ? new Date(ksiazka.przeczytanoW) : null;
  const miesiacNazwa = dataObiekt ? MIESIACE[dataObiekt.getMonth()] : "Brak daty";
  const rokCyfra = dataObiekt ? dataObiekt.getFullYear() : "Brak daty";

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="border-b border-slate-200 pb-5 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-2">
            {ksiazka.tytul}
          </h1>
          <p className="text-lg font-medium text-slate-600 capitalize">
            Autor:{" "}
            <span className="text-slate-900 font-semibold">
              {ksiazka.autor}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Seria
            </span>
            <span className="text-base font-medium text-slate-800">
              {ksiazka.jednotomowka ? "───────────────────" : ksiazka.nazwaSerii}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Format
            </span>
            <span className="text-base font-medium text-slate-800">
              {ksiazka.formatKsiazki}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Liczba stron
            </span>
            <span className="text-base font-medium text-slate-800">
              {/* Liczba stron */}
              350
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Ocena
            </span>
            <span className="text-base font-medium text-slate-800">
              {ksiazka.ocena}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Miesiąc przeczytania
            </span>
            <span className="text-base font-medium text-slate-800">
              {miesiacNazwa}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Rok
            </span>
            <span className="text-base font-medium text-slate-800">
              {rokCyfra}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Gatunki:
          </h3>
          <div className="flex flex-wrap gap-2">
            {listaGatunkow.length > 0 ? (
                listaGatunkow.map((gatunek, index) => (
                    <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-900 text-sm font-medium"
                    >
                    {gatunek}
                    </span>
                ))
                ) : (
                <span className="text-slate-500 italic text-sm">
                    Brak przypisanych gatunków
                </span>
            )}
          </div>
        </div>

        <hr className="border-slate-200 mb-6" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
            >
              Edytuj
            </button>

            <button
              type="button"
              className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg border border-red-200 transition-colors text-sm"
            >
              Usuń
            </button>
          </div>

          <Link
            to="/"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm"
          >
            Powrót do listy
          </Link>
        </div>
      </div>
    </div>
  );
}