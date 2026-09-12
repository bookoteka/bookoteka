// Strona edytowania - rout: /ksiazka/:id/edytuj

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eq } from "drizzle-orm";
import { baza } from "../db/polaczenie";
import { ksiazki, ksiazkiGatunki, gatunki } from "../db/schemat";

export default function Edytuj() {
  const { id } = useParams<{ id: string }>();
  const nawigacja = useNavigate();

  const [tytul, setTytul] = useState<string>("");
  const [autor, setAutor] = useState<string>("");
  const [jednotomowka, setJednotomowka] = useState<boolean>(false);
  const [nazwaSerii, setNazwaSerii] = useState<string>("");
  const [strony, setStrony] = useState<number | "">("");
  const [ocena, setOcena] = useState<string>("");
  const [formatKsiazki, setFormatKsiazki] = useState<string>("");

  const [listaGatunkow, setListaGatunkow] = useState<{ id: number; nazwa: string }[]>([]);
  const [wybraneGatunki, setWybraneGatunki] = useState<number[]>([]);
  const [bladWalidacji, setBladWalidacji] = useState<string | null>(null);
  const [ladowanie, setLadowanie] = useState<boolean>(true);

  useEffect(() => {
    async function pobierzDane() {
      if (!id) return;
      const idLiczba = Number(id);

      try {
        const wszystkieGatunki = await baza.select().from(gatunki);
        setListaGatunkow(wszystkieGatunki);

        const wynikKsiazka = await baza
          .select()
          .from(ksiazki)
          .where(eq(ksiazki.id, idLiczba));

        if (wynikKsiazka.length > 0) {
          const k = wynikKsiazka[0];
          setTytul(k.tytul || "");
          setAutor(k.autor || "");
          setJednotomowka(k.jednotomowka ?? false);
          setNazwaSerii(k.nazwaSerii || "");
          setStrony(k.strony ?? "");
          setOcena(k.ocena || "");
          setFormatKsiazki(k.formatKsiazki || "");
        }

        const przypisaneGatunki = await baza
          .select({ gatunekId: ksiazkiGatunki.gatunekId })
          .from(ksiazkiGatunki)
          .where(eq(ksiazkiGatunki.ksiazkaId, idLiczba));

        setWybraneGatunki(przypisaneGatunki.map((g) => g.gatunekId));
      } catch (blad) {
        console.error("Błąd podczas pobierania danych do edycji:", blad);
      } finally {
        setLadowanie(false);
      }
    }

    pobierzDane();
  }, [id]);

  if (ladowanie) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500 font-medium">Ładowanie danych książki...</p>
      </div>
    );
  }

  const obsluzZapis = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) return;
    const idLiczba = Number(id);

    if (wybraneGatunki.length === 0) {
      setBladWalidacji("Wybierz przynajmniej jeden gatunek!");
      return;
    }
    setBladWalidacji(null);

    try {
      await baza
        .update(ksiazki)
        .set({
          tytul: tytul,
          autor: autor,
          formatKsiazki: formatKsiazki,
          jednotomowka: jednotomowka,
          nazwaSerii: jednotomowka ? "" : nazwaSerii,
          ocena: ocena,
          strony: Number(strony),
        })
        .where(eq(ksiazki.id, idLiczba));

      await baza
        .delete(ksiazkiGatunki)
        .where(eq(ksiazkiGatunki.ksiazkaId, idLiczba));

      if (wybraneGatunki.length > 0) {
        const rekordyGatunkow = wybraneGatunki.map((idGatunku) => ({
          ksiazkaId: idLiczba,
          gatunekId: idGatunku,
        }));
        await baza.insert(ksiazkiGatunki).values(rekordyGatunkow);
      }

      nawigacja(`/ksiazka/${idLiczba}`);
    } catch (blad) {
      console.error("Błąd podczas edycji książki:", blad);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 overflow-hidden">
      <div className="max-w-2xl mx-auto bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm scale-95 transform-gpu origin-top">
        <h1 className="text-4xl font-bold mb-6 text-indigo-800">
          Edytuj książkę
        </h1>

        <form className="space-y-5" onSubmit={obsluzZapis}>
          <div>
            <label htmlFor="tytul">Tytuł:</label>
            <br />
            <input
              type="text"
              id="tytul"
              name="tytul"
              value={tytul}
              onChange={(e) => setTytul(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          <div>
            <label htmlFor="autor">Autor:</label>
            <br />
            <input
              type="text"
              id="autor"
              name="autor"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          <div>
            <input
              type="checkbox"
              id="jednotomowka_checkbox"
              name="jednotomowka_checkbox"
              checked={jednotomowka}
              onChange={(e) => {
                const czyZaznaczone = e.target.checked;
                setJednotomowka(czyZaznaczone);
                if (czyZaznaczone) setNazwaSerii("");
              }}
            />
            <label htmlFor="jednotomowka_checkbox" className="ml-2">Jednotomówka</label>
          </div>

          <div>
            <label htmlFor="nazwa_serii_input">Nazwa serii:</label>
            <br />
            <input
              type="text"
              id="nazwa_serii_input"
              name="nazwa_serii_input"
              value={nazwaSerii}
              onChange={(e) => setNazwaSerii(e.target.value)}
              disabled={jednotomowka}
              required={!jednotomowka}
              className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 ${
                jednotomowka ? "cursor-not-allowed" : "cursor-auto"
              }`}
            />
          </div>

          <div>
            <label htmlFor="strony">Liczba stron:</label>
            <br />
            <input
              type="number"
              id="strony"
              name="strony"
              value={strony}
              onChange={(e) => setStrony(e.target.value === "" ? "" : Number(e.target.value))}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div>
            <label htmlFor="ocena">Ocena:</label>
            <br />
            <div className="relative">
              <select
                id="ocena"
                name="ocena"
                value={ocena}
                onChange={(e) => setOcena(e.target.value)}
                required
                className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 pr-8 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer text-sm"
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
                value={formatKsiazki}
                onChange={(e) => setFormatKsiazki(e.target.value)}
                required
                className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 pr-8 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer text-sm"
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <hr />

          <h3 className="font-semibold text-slate-900 mb-3">Gatunki:</h3>
          <div className="flex flex-wrap gap-2.5">
            {listaGatunkow.map((gatunekObiekt) => {
              const czyZaznaczony = wybraneGatunki.includes(gatunekObiekt.id);
              return (
                <label
                  key={gatunekObiekt.id}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center gap-2 text-sm text-slate-700 transition-colors has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50/50 has-[:checked]:text-indigo-900"
                >
                  <input
                    type="checkbox"
                    checked={czyZaznaczony}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setWybraneGatunki([...wybraneGatunki, gatunekObiekt.id]);
                      } else {
                        setWybraneGatunki(
                          wybraneGatunki.filter((gid) => gid !== gatunekObiekt.id)
                        );
                      }
                    }}
                  />
                  <span>{gatunekObiekt.nazwa}</span>
                </label>
              );
            })}
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
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors cursor-pointer text-center"
            >
              Zapisz książkę
            </button>

            <Link
              to={`/ksiazka/${id}`}
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