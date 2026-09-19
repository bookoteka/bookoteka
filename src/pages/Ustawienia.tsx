// Ustawienia - rout: /ustawienia

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eq } from "drizzle-orm";
import { baza } from "../db/polaczenie";
import { gatunki, ksiazkiGatunki } from "../db/schemat";
import { appDataDir, downloadDir, join } from "@tauri-apps/api/path";
import { copyFile } from "@tauri-apps/plugin-fs";
import { save, open } from "@tauri-apps/plugin-dialog";
import { DOSTEPNE_KOLORY } from "../types/kolory";

function ImportDanych() {
  const [wgrywanie, setWgrywanie] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [blad, setBlad] = useState<string | null>(null);

  const obslugaImportu = async () => {
    try {
      setWgrywanie(true);
      setBlad(null);

      const wybralPlik = await open({
        filters: [{ name: "Baza danych SQLite", extensions: ["db"] }],
      });

      if (!wybralPlik) {
        setWgrywanie(false);
        return;
      }

      const zrodlowaSciezka = wybralPlik;

      const katalogAplikacji = await appDataDir();
      const docelowaSciezka = await join(katalogAplikacji, "bookoteka.db");

      await copyFile(zrodlowaSciezka, docelowaSciezka);

      setToast("Baza danych została pomyślnie zaimportowana! Zrestartuj aplikację, aby odświeżyć dane.");
    } catch (err) {
      console.error("Błąd importu:", err);
      setBlad("Nie udało się zaimportować bazy danych.");
    } finally {
      setWgrywanie(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl text-indigo-800">Import danych</h1>
        <p className="text-sm text-slate-500 mt-1">
          Wczytaj zewnętrzną kopię zapasową bazy danych SQLite (.db).
        </p>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">✕</button>
        </div>
      )}

      {blad && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl flex items-center justify-between shadow-sm">
          <span>{blad}</span>
          <button onClick={() => setBlad(null)} className="text-rose-600 hover:text-rose-900 font-bold">✕</button>
        </div>
      )}

      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Przenoszenie kopii zapasowej</h3>
            <p className="text-xs text-slate-500">
              Uwaga: Importowanie nowej bazy nadpisze obecne książki i gatunki.
            </p>
          </div>
        </div>

        <button
          onClick={obslugaImportu}
          disabled={wgrywanie}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {wgrywanie ? "Importowanie..." : "Wybierz plik bazy (.db)"}
        </button>
      </div>
    </div>
  );
}

function EksportDanych() {
  const [pobieranie, setPobieranie] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const obslugaEksportu = async () => {
    try {
      setPobieranie(true);

      const katalogAplikacji = await appDataDir();
      const sciezkaBazy = await join(katalogAplikacji, "bookoteka.db");

      const domyslnaNazwa = `bookoteka.db`;

      const sciezkaDocelowa = await save({
        defaultPath: await join(await downloadDir(), domyslnaNazwa),
        filters: [{ name: "Baza danych SQLite", extensions: ["db"] }],
      });

      if (!sciezkaDocelowa) {
        setPobieranie(false);
        return;
      }

      await copyFile(sciezkaBazy, sciezkaDocelowa);

      setToast("Kopia zapasowa została pomyślnie zapisana!");
      setTimeout(() => setToast(null), 4000);
    } catch (blad) {
      console.error("Błąd eksportu:", blad);
      alert("Nie udało się wyeksportować bazy danych.");
    } finally {
      setPobieranie(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl text-indigo-800">Eksport danych</h1>
        <p className="text-sm text-slate-500 mt-1">
          Zapisz kopię zapasową bazy danych aplikacji w wybranym miejscu na dysku.
        </p>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">✕</button>
        </div>
      )}

      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Kopia bezpieczeństwa (SQLite)</h3>
            <p className="text-xs text-slate-500">Zawiera wszystkie książki, ocenione pozycje oraz gatunki.</p>
          </div>
        </div>

        <button
          onClick={obslugaEksportu}
          disabled={pobieranie}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {pobieranie ? "Eksportowanie..." : "Eksportuj bazy danych"}
        </button>
      </div>
    </div>
  );
}

function TrybAplikacji() {
  const [wybranyOdcien, setWybranyOdcien] = useState<string>(
    () => localStorage.getItem("motyw_kolor") || "239"
  );

  const obslugaZmianyKoloru = (odcien: string) => {
    setWybranyOdcien(odcien);
    document.documentElement.style.setProperty("--p-odcien", odcien);
    localStorage.setItem("motyw_kolor", odcien);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl text-primary-800 font-bold">Wygląd</h1>
        <p className="text-sm text-slate-500 mt-1">
          Dostosuj kolor przewodni aplikacji.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-slate-800">Kolor akcentu</h3>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {DOSTEPNE_KOLORY.map((kolor) => {
            const jestWybrany = wybranyOdcien === kolor.odcien;
            return (
              <button
                key={kolor.id}
                onClick={() => obslugaZmianyKoloru(kolor.odcien)}
                title={kolor.nazwa}
                className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 ${
                  jestWybrany
                    ? "border-primary-600 bg-primary-50/50 ring-2 ring-primary-600/30"
                    : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center"
                  style={{ backgroundColor: kolor.kodHex }}
                >
                  {jestWybrany && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white drop-shadow-sm"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-600 mt-2">
                  {kolor.nazwa}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Gatunki() {
  const [listaGatunkow, setListaGatunkow] = useState<{ id: number; nazwa: string }[]>([]);
  const [nowaNazwa, setNowaNazwa] = useState("");
  const [komunikatBledu, setKomunikatBledu] = useState<string | null>(null);

  const pobierzGatunki = async () => {
    try {
      const wynik = await baza.select().from(gatunki);
      setListaGatunkow(wynik);
    } catch (blad) {
      console.error("Błąd pobierania gatunków:", blad);
    }
  };

  useEffect(() => {
    pobierzGatunki();
  }, []);

  const obslugaDodawania = async (e: React.FormEvent) => {
    e.preventDefault();
    const czystaNazwa = nowaNazwa.trim().replace(/\s+/g, " ");
    
    if (!czystaNazwa) return;

    const istnieje = listaGatunkow.some(
      (g) => g.nazwa.toLowerCase() === czystaNazwa.toLowerCase()
    );

    if (istnieje) {
      setKomunikatBledu(`Gatunek "${czystaNazwa}" już istnieje na liście.`);
      return;
    }

    try {
      await baza.insert(gatunki).values({ nazwa: czystaNazwa });
      setNowaNazwa("");
      setKomunikatBledu(null);
      pobierzGatunki();
    } catch (blad) {
      console.error("Błąd dodawania gatunku:", blad);
      setKomunikatBledu("Gatunek o takiej nazwie już istnieje w bazie danych.");
    }
  };

  const obslugaUsuwania = async (id: number, nazwa: string) => {
    try {
      const powiazane = await baza
        .select()
        .from(ksiazkiGatunki)
        .where(eq(ksiazkiGatunki.gatunekId, id));

      if (powiazane.length > 0) {
        setKomunikatBledu(
          `Nie można usunąć gatunku "${nazwa}" – jest przypisany do ${powiazane.length} książek.`
        );
        return;
      }

      await baza.delete(gatunki).where(eq(gatunki.id, id));
      setKomunikatBledu(null);
      pobierzGatunki();
    } catch (blad) {
      console.error("Błąd usuwania gatunku:", blad);
      setKomunikatBledu("Wystąpił błąd podczas usuwania z bazy.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl text-indigo-800">Gatunki</h1>
      <form onSubmit={obslugaDodawania} className="flex gap-3">
        <input
          type="text"
          value={nowaNazwa}
          onChange={(e) => setNowaNazwa(e.target.value)}
          placeholder="Wpisz nazwę nowego gatunku..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center"
          title="Zatwierdź"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </form>

      {komunikatBledu && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex justify-between items-center">
          <span>{komunikatBledu}</span>
          <button
            onClick={() => setKomunikatBledu(null)}
            className="font-bold text-red-500 hover:text-red-800"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {listaGatunkow.map((gatunek) => (
          <div
            key={gatunek.id}
            className="flex items-center justify-between px-4 py-2.5 bg-indigo-500 text-white rounded-xl shadow-sm font-medium"
          >
            <span>{gatunek.nazwa}</span>
            <button
              onClick={() => obslugaUsuwania(gatunek.id, gatunek.nazwa)}
              className="p-1 hover:bg-indigo-600 rounded-lg transition-colors text-white/90 hover:text-white"
              title={`Usuń ${gatunek.nazwa}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        Zabrania się:<br/>
        1. Kopiowania, powielania oraz rozpowszechniania kodu źródłowego w całości lub w części.<br/>
        2. Modyfikowania, tworzenia dzieł pochodnych oraz dekompilacji kodu.<br/>
        3. Wykorzystywania kodu źródłowego w innych projektach bez wyraźnej, pisemnej zgody autora.<br/>
      </h3>
    </div>
  )
}

type Zakladka = "import" | "eksport" | "tryb" | "o-aplikacji" | "gatunki";

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
            Eksport danych
          </button>

          <button
            onClick={() => setAktywnaZakladka("tryb")}
            className={`text-left px-4 py-2 rounded-lg text-lg font-medium transition-colors ${
              aktywnaZakladka === "tryb"
                ? "bg-indigo-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Wygląd
          </button>

          <button
            onClick={() => setAktywnaZakladka("gatunki")}
            className={`text-left px-4 py-2 rounded-lg text-lg font-medium transition-colors ${
              aktywnaZakladka === "gatunki"
                ? "bg-indigo-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Gatunki
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

        <main className="col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-75">
          {aktywnaZakladka === "import" && <ImportDanych />}
          {aktywnaZakladka === "eksport" && <EksportDanych />}
          {aktywnaZakladka === "tryb" && <TrybAplikacji />}
          {aktywnaZakladka === "o-aplikacji" && <OAplikacji />}
          {aktywnaZakladka === "gatunki" && <Gatunki />}
        </main>
      </div>
    </div>
  );
}