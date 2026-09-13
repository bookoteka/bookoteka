// Strona główna raportów - rout: /raporty

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pobierzListeRaportow, RaportPlik } from "../scripts/raporty";

export default function Raporty() {
  const [czyModalOtwarty, setCzyModalOtwarty] = useState<boolean>(false);
  const [raporty, setRaporty] = useState<RaportPlik[]>([]);
  const [ladowanie, setLadowanie] = useState<boolean>(true);

  useEffect(() => {
    async function wczytajRaporty() {
      try {
        const pliki = await pobierzListeRaportow();
        setRaporty(pliki);
      } catch (blad) {
        console.error("Błąd podczas pobierania raportów:", blad);
      } finally {
        setLadowanie(false);
      }
    }

    wczytajRaporty();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Nagłówek i przyciski akcji */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Podsumowania i Raporty</h1>
          <p className="text-slate-500 text-sm mt-1">Wygenerowane raporty czytelnicze zapisane w systemie.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
            </svg>
            Strona główna
          </Link>

          <button 
            type="button" 
            onClick={() => setCzyModalOtwarty(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Generuj raport
          </button>
        </div>
      </div>

      {/* Lista plików PDF */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Dostępne pliki PDF</h2>
          <span className="text-xs font-medium px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full">
            Pliki: {raporty.length}
          </span>
        </div>

        {/* Dynamiczna lista wyrenderowanych plików */}
        {!ladowanie && raporty.length > 0 && (
          <div className="divide-y divide-slate-100">
            {raporty.map((raport) => (
              <div key={raport.nazwa} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900 block">{raport.nazwa}</span>
                    <span className="text-xs text-slate-500">Dokument PDF</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link 
                    to={`/raporty/${encodeURIComponent(raport.nazwa)}`} 
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                  >
                    Otwórz podgląd &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stan pusty */}
        {!ladowanie && raporty.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Brak wygenerowanych raportów.
          </div>
        )}
      </div>

      {/* Modal wyboru daty */}
      {czyModalOtwarty && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Generuj podsumowanie</h3>
              <button 
                type="button" 
                onClick={() => setCzyModalOtwarty(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Typ raportu</label>
                <select name="typ" id="wybor-typu" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="miesieczne">Miesięczne</option>
                  <option value="roczne">Roczne</option>
                </select>
              </div>

              <div id="kontener-miesiac">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Miesiąc</label>
                <select name="miesiac" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="1">Styczeń</option>
                  <option value="2">Luty</option>
                  <option value="3">Marzec</option>
                  <option value="4">Kwiecień</option>
                  <option value="5">Maj</option>
                  <option value="6">Czerwiec</option>
                  <option value="7">Lipiec</option>
                  <option value="8">Sierpień</option>
                  <option value="9">Wrzesień</option>
                  <option value="10">Październik</option>
                  <option value="11">Listopad</option>
                  <option value="12">Grudzień</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Rok</label>
                <select name="rok" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setCzyModalOtwarty(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Anuluj
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Generuj PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}