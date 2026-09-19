// Widok raportu - rout: /raporty/:id

import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { pobierzFolderRaportow, pobierzRaportDoPobrane, usunRaport } from "../scripts/raporty";
import { join } from "@tauri-apps/api/path";
import { readFile } from "@tauri-apps/plugin-fs";

export default function WidokRaportu() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [urlPdf, setUrlPdf] = useState<string>("");
  const [pokazPotwierdzenie, setPokazPotwierdzenie] = useState<boolean>(false);
  const [pobieranie, setPobieranie] = useState<boolean>(false);
  const [powiadomienie, setPowiadomienie] = useState<string | null>(null);
  const nazwaPliku = id ? decodeURIComponent(id) : "";

  useEffect(() => {
    async function pobierzUrlPliku() {
      if (!nazwaPliku) return;
      try {
        const folder = await pobierzFolderRaportow();
        const sciezka = await join(folder, nazwaPliku);
      
        const bajty = await readFile(sciezka);
        const blob = new Blob([bajty], { type: "application/pdf" });
        const obiektUrl = URL.createObjectURL(blob);
        
        setUrlPdf(obiektUrl);

        return () => {
          URL.revokeObjectURL(obiektUrl);
        };
      } catch (blad) {
        console.error("Błąd ładowania podglądu PDF:", blad);
      }
    }

    pobierzUrlPliku();
  }, [nazwaPliku]);

  const obsluzUsun = async () => {
    if (!nazwaPliku) return;
    try {
      await usunRaport(nazwaPliku);
      navigate("/raporty");
    } catch (blad) {
      console.error("Błąd podczas usuwania raportu:", blad);
    }
  };

  const obsluzPobieranie = async () => {
    if (!nazwaPliku) return;
    try {
      setPobieranie(true);
      await pobierzRaportDoPobrane(nazwaPliku);
      
      setPowiadomienie(`Zapisano plik "${nazwaPliku}" w folderze Pobrane`);
      setTimeout(() => {
        setPowiadomienie(null);
      }, 4000);
    } catch (blad) {
      console.error("Błąd podczas pobierania pliku:", blad);
      setPowiadomienie("Wystąpił błąd podczas zapisywania pliku");
      setTimeout(() => setPowiadomienie(null), 4000);
    } finally {
      setPobieranie(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Pływające powiadomienie (Toast) */}
      {powiadomienie && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">{powiadomienie}</span>
          <button 
            type="button"
            onClick={() => setPowiadomienie(null)}
            className="ml-2 text-slate-400 hover:text-white p-0.5 rounded-md transition-colors border-0 bg-transparent cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Górny pasek nawigacji i akcji */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/raporty"
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{nazwaPliku}</h1>
            <p className="text-xs text-slate-500">Podgląd wygenerowanego raportu PDF</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={obsluzPobieranie}
            disabled={pobieranie}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer border-0 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {pobieranie ? "Pobieranie..." : "Pobierz PDF"}
          </button>

          <button
            type="button"
            onClick={() => setPokazPotwierdzenie(true)}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors text-sm cursor-pointer border-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Usuń PDF
          </button>
        </div>
      </div>

      {/* Kontener podglądu iframe z Blob URL */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-2">
        {urlPdf ? (
          <iframe
            src={urlPdf}
            title="Podgląd PDF"
            className="w-full h-200 rounded-lg border-0"
          />
        ) : (
          <div className="p-12 text-center text-slate-500">Ładowanie podglądu...</div>
        )}
      </div>

      {/* Modal potwierdzenia usunięcia */}
      {pokazPotwierdzenie && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Usunąć raport?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Czy na pewno chcesz usunąć plik <span className="font-semibold text-slate-800">{nazwaPliku}</span>? Ta operacja jest nieodwracalna.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPokazPotwierdzenie(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors cursor-pointer border-0"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={obsluzUsun}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer border-0"
              >
                Tak, usuń
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}