// Ustawienia - rout: /ustawienia

import { useState } from "react";
import { Link } from "react-router-dom";

const ImportDanych = () => <div>Zawartość: Import danych</div>;
const EksportDanych = () => <div>Zawartość: Eksport danych</div>;
const TrybAplikacji = () => <div>Zawartość: Wygląd / Tryb</div>;

function OAplikacji() {
  return (
    <div>
      <h1 className="text-4xl text-indigo-800">bookoteka</h1>
      <h2 className="text-lg">Autor: <a href="https://github.com/bookoteka" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Bookoteka Apps</a> by Karl Evans</h2>
      <hr className="my-4 border-slate-200" />
      <h3>Copyright (c) 2026 Karl Evans. Wszelkie prawa zastrzeżone.
        <br/><br/>
        Niniejsze oprogramowanie jest udostępniane wyłącznie do użytku (uruchamiania i korzystania z aplikacji). 
        Wszelkie prawa do kodu źródłowego, architektury oraz zasobów projektu pozostają wyłączną własnością autora. 
        <br/><br/>
        Zabrania się:
        1. Kopiowania, powielania oraz rozpowszechniania kodu źródłowego w całości lub w części.
        2. Modyfikowania, tworzenia dzieł pochodnych oraz dekompilacji kodu.
        3. Wykorzystywania kodu źródłowego w innych projektach bez wyraźnej, pisemnej zgody autora.
      </h3>
    </div>
  )
}

type Zakladka = "import" | "eksport" | "tryb" | "o-aplikacji";

export default function Ustawienia() {
  const [aktywnaZakladka, setAktywnaZakladka] = useState<Zakladka>("import");

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-indigo-900 mb-8">Ustawienia</h1>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
          </svg>
          Strona główna
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <aside className="col-span-1 flex flex-col space-y-2">
          <button
            onClick={() => setAktywnaZakladka("import")}
            className={`text-left px-4 py-2 rounded-lg text-lg font-medium transition-colors ${
              aktywnaZakladka === "import"
                ? "bg-indigo-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Import danych
          </button>

          <button
            onClick={() => setAktywnaZakladka("eksport")}
            className={`text-left px-4 py-2 rounded-lg text-lg font-medium transition-colors ${
              aktywnaZakladka === "eksport"
                ? "bg-indigo-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Eksport
          </button>

          <button
            onClick={() => setAktywnaZakladka("tryb")}
            className={`text-left px-4 py-2 rounded-lg text-lg font-medium transition-colors ${
              aktywnaZakladka === "tryb"
                ? "bg-indigo-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Tryb
          </button>

          <button
            onClick={() => setAktywnaZakladka("o-aplikacji")}
            className={`text-left px-4 py-2 rounded-lg text-lg font-medium transition-colors ${
              aktywnaZakladka === "o-aplikacji"
                ? "bg-indigo-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            O aplikacji
          </button>
        </aside>

        <main className="col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
          {aktywnaZakladka === "import" && <ImportDanych />}
          {aktywnaZakladka === "eksport" && <EksportDanych />}
          {aktywnaZakladka === "tryb" && <TrybAplikacji />}
          {aktywnaZakladka === "o-aplikacji" && <OAplikacji />}
        </main>
      </div>
    </div>
  );
}