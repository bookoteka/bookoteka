// Strona dodawania - rout: /dodaj

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baza } from "../db/polaczenie";
import { ksiazki, ksiazkiGatunki, gatunki } from "../db/schemat";

export default function Dodaj() {
  const [jednotomowka, setJednotomowka] = useState<boolean>(false)
  const [nazwaSerii, setNazwaSerii] = useState<string>('')
  const [listaGatunkow, setListaGatunkow] = useState<{ id: number; nazwa: string }[]>([]);
  const [wybraneGatunki, setWybraneGatunki] = useState<number[]>([]);
  const [bladWalidacji, setBladWalidacji] = useState<string | null>(null);
  useEffect(() => {
    async function pobierzGatunki() {
      try {
        const wynik = await baza.select().from(gatunki);
        setListaGatunkow(wynik);
      } catch (blad) {
        console.error("Błąd podczas pobierania gatunków z bazy:", blad);
      }
    }
    pobierzGatunki();
  }, []);
  const nawigacja = useNavigate();
  const obsluzZapis = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (wybraneGatunki.length === 0) {
      setBladWalidacji("Wybierz przynajmniej jeden gatunek!");
      return;
    }
    setBladWalidacji(null);
    const formularzDane = new FormData(e.currentTarget);
    try {
      const wynik = await baza.insert(ksiazki).values({
        tytul: formularzDane.get("tytul") as string,
        autor: formularzDane.get("autor") as string,
        formatKsiazki: formularzDane.get("format_ksiazki") as string,
        jednotomowka: jednotomowka,
        nazwaSerii: jednotomowka ? "" : nazwaSerii,
        ocena: formularzDane.get("ocena") as string,
        strony: Number(formularzDane.get("strony")),
        przeczytanoW: new Date().toISOString()
      }).returning({ id: ksiazki.id });

      const idKsiazki = wynik[0].id;

      if (wybraneGatunki.length > 0) {
        const rekordyGatunkow = wybraneGatunki.map((idGatunku) => ({
          ksiazkaId: idKsiazki,
          gatunekId: idGatunku,
        }));
        await baza.insert(ksiazkiGatunki).values(rekordyGatunkow);
      }

      nawigacja("/");
    } catch (blad) {
      console.error("Błąd podczas zapisywania książki:", blad);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 overflow-hidden">
      <div className="max-w-2xl mx-auto bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm scale-95 
      transform-gpu origin-top">
        <h1 className="text-4xl font-bold mb-6 text-primary-800">
          Dodaj nową książkę
        </h1>

        <form className="space-y-5" onSubmit={obsluzZapis}>
          <div>
            <label htmlFor="tytul">Tytuł:</label>
            <br />
            <input
              type="text"
              id="tytul"
              name="tytul"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          <div>
            <label htmlFor="autor">Autor:</label>
            <br />
            <input
              type="text"
              id="autor"
              name="autor"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          <div>
            <input type="checkbox" id="jednotomowka_checkbox" name="jednotomowka_checkbox" onChange={(e) => {const czyZaznaczone = e.target.checked; setJednotomowka(czyZaznaczone); if (czyZaznaczone) setNazwaSerii("");}}/>
            <label htmlFor="jednotomowka_checkbox">Jednotomówka</label>
          </div>

          <div>
            <label htmlFor="nazwa_serii_input">Nazwa serii:</label>
            <br />
            <input
              type="text"
              id="nazwa_serii_input"
              name="nazwa_serii_input"
              className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100 disabled:text-slate-400 ${jednotomowka ? 'cursor-not-allowed' : 'cursor-auto'}`}
              disabled={jednotomowka ? true : false}
              value={nazwaSerii}
              onChange={(e) => setNazwaSerii(e.target.value)}
              required={jednotomowka ? false : true}
            />
          </div>

          <div>
            <label htmlFor="strony">Liczba stron:</label>
            <br />
            <input
              type="number"
              id="strony"
              name="strony"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100 disabled:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div>
            <label htmlFor="ocena">Ocena:</label>
            <br />
            <div className="relative">
              <select
                id="ocena"
                name="ocena"
                required
                defaultValue=""
                className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 pr-8 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer text-sm"
              >
                <option value="" disabled>
                  Wybierz ocenę
                </option>
                <option value="1/6 ⭐️">1/6 ⭐️</option>
                <option value="2/6 ⭐️">2/6 ⭐️</option>
                <option value="3/6 ⭐️">3/6 ⭐️</option>
                <option value="4/6 ⭐️">4/6 ⭐️</option>
                <option value="5/6 ⭐️">5/6 ⭐️</option>
                <option value="6/6 ⭐️">6/6 ⭐️</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="format_ksiazki">Format książki:</label>
            <br />
            <div className="relative">
              <select
                id="format_ksiazki"
                name="format_ksiazki"
                required
                defaultValue=""
                className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 pr-8 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer text-sm"
              >
                <option value="" disabled>
                  Wybierz format
                </option>
                <option value="Papierowa">Papierowa</option>
                <option value="E-book">E-book</option>
                <option value="Audiobook">Audiobook</option>
                <option value="Synchrobook">Synchrobook</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <hr />

          <h3 className="font-semibold text-slate-900 mb-3">Gatunki:</h3>
          <div className="flex flex-wrap gap-2.5">
            {listaGatunkow.map((gatunekObiekt) => (
              <label
                key={gatunekObiekt.id}
                className="px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center gap-2 text-sm text-slate-700 transition-colors has-checked:border-primary-600 has-checked:bg-primary-50/50 has-checked:text-primary-900"
              >
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setWybraneGatunki([...wybraneGatunki, gatunekObiekt.id]);
                    } else {
                      setWybraneGatunki(wybraneGatunki.filter((id) => id !== gatunekObiekt.id));
                    }
                  }}
                />
                <span>{gatunekObiekt.nazwa}</span>
              </label>
            ))}
          </div>
          {bladWalidacji && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {bladWalidacji}
            </div>
          )}

          <hr className="border-slate-200 my-4" />

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition-colors cursor-pointer text-center"
            >
              Zapisz książkę
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-center"
            >
              Anuluj
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}