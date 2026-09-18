// Szablon podsumowania rocznego

import { DaneRaportuRok } from "../types/raporty";

interface SzablonRaportRokProps {
  dane: DaneRaportuRok;
}

export default function SzablonRaportRok({ dane }: SzablonRaportRokProps) {
  return (
    <div className="bg-white text-slate-800 font-sans p-6" style={{ width: "794px", minHeight: "1123px" }}>
      {/* Nagłówek */}
      <header className="border-b-2 border-slate-900 pb-3 mb-5 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Podsumowanie {dane.rok}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Roczny raport aktywności czytelniczej</p>
        </div>
        <div className="text-right text-xs text-slate-400">
          Bookoteka
        </div>
      </header>

      {/* Kafelki ze statystykami */}
      <section className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Przeczytane książki</span>
          <span className="text-3xl font-extrabold text-indigo-600">{dane.przeczytaneKsiazki}</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Przeczytane strony</span>
          <span className="text-3xl font-extrabold text-indigo-600">{dane.przeczytaneStrony}</span>
        </div>
      </section>

      {/* Sekcja wykresów z formatami oraz ocenami */}
      <section className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 pb-1 border-b border-slate-200">Formaty</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Papierowa</span>
              <span className="font-bold text-slate-900">{dane.formaty.papier || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">E-book</span>
              <span className="font-bold text-slate-900">{dane.formaty.ebook || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Audiobook</span>
              <span className="font-bold text-slate-900">{dane.formaty.audiobook || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Synchrobook</span>
              <span className="font-bold text-slate-900">{dane.formaty.synchrobook || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 pb-1 border-b border-slate-200">Oceny</h3>
          <div className="space-y-1.5 text-xs">
            {[6, 5, 4, 3, 2, 1].map((ocena) => (
              <div key={ocena} className="flex justify-between items-center">
                <span className="text-slate-700">{ocena}/6 ⭐️</span>
                <span className="font-bold text-slate-900">{dane.oceny[ocena] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabelka z gatunkami */}
      <section className="mb-5">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Popularność gatunków</h2>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase">
              <tr>
                <th className="py-2 px-3 font-semibold">Gatunek</th>
                <th className="py-2 px-3 font-semibold text-right">Liczba książek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dane.gatunki.length > 0 ? (
                dane.gatunki.map((g) => (
                  <tr key={g.gatunek} className="hover:bg-slate-50">
                    <td className="py-1.5 px-3 font-medium text-slate-800">{g.gatunek}</td>
                    <td className="py-1.5 px-3 text-right font-bold text-indigo-600">{g.liczba}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-2 px-3 text-center text-slate-400">Brak danych</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tabelka z książkami z kolumną Miesiąc */}
      <section className="mb-5">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Lista przeczytanych książek</h2>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase">
              <tr>
                <th className="py-2 px-2.5 font-semibold text-center w-8">Lp.</th>
                <th className="py-2 px-2.5 font-semibold">Tytuł</th>
                <th className="py-2 px-2.5 font-semibold">Autor</th>
                <th className="py-2 px-2.5 font-semibold">Seria</th>
                <th className="py-2 px-2.5 font-semibold">Format</th>
                <th className="py-2 px-2.5 font-semibold text-center">Ocena</th>
                <th className="py-2 px-2.5 font-semibold">Gatunki</th>
                <th className="py-2 px-2.5 font-semibold text-center">Miesiąc</th>
                <th className="py-2 px-2.5 font-semibold text-right">Strony</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dane.ksiazki.length > 0 ? (
                dane.ksiazki.map((k) => (
                  <tr key={k.lp} className="hover:bg-slate-50">
                    <td className="py-1.5 px-2.5 text-center text-slate-400 font-medium">{k.lp}</td>
                    <td className="py-1.5 px-2.5 font-semibold text-slate-900">{k.tytul}</td>
                    <td className="py-1.5 px-2.5 text-slate-700">{k.autor}</td>
                    <td className="py-1.5 px-2.5 text-slate-500">{k.seria || "-"}</td>
                    <td className="py-1.5 px-2.5 text-slate-600">{k.format}</td>
                    <td className="py-1.5 px-2.5 text-center font-bold text-slate-800">{k.ocena}</td>
                    <td className="py-1.5 px-2.5 text-slate-600">{k.gatunki}</td>
                    <td className="py-1.5 px-2.5 text-center text-slate-600 font-medium">{k.miesiac || "-"}</td>
                    <td className="py-1.5 px-2.5 text-right font-medium text-slate-900">{k.strony}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-3 px-2.5 text-center text-slate-400">Brak przeczytanych książek w tym roku.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}