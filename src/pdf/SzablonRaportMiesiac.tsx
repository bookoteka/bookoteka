// Szablon podsumowania miesięcznego

export default function SzablonRaportMiesiac() {
  return (
    <div className="w-full bg-white text-slate-800 font-sans p-6">
      {/* Nagłówek */}
      <header className="border-b-2 border-slate-900 pb-3 mb-5 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Maj 2026 – podsumowanie</h1>
          <p className="text-xs text-slate-500 mt-0.5">Raport aktywności czytelniczej</p>
        </div>
        <div className="text-right text-xs text-slate-400">
          System Czytelniczy
        </div>
      </header>

      {/* Kafelki ze statystykami */}
      <section className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Przeczytane książki</span>
          <span className="text-3xl font-extrabold text-indigo-600">0</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Przeczytane strony</span>
          <span className="text-3xl font-extrabold text-indigo-600">0</span>
        </div>
      </section>

      {/* Sekcja z sekcjami wykresów/rozkładów */}
      <section className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 pb-1 border-b border-slate-200">Formaty</h3>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700">Papier</span>
              <span className="font-bold text-slate-900">0</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700">Ebook</span>
              <span className="font-bold text-slate-900">0</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 pb-1 border-b border-slate-200">Oceny</h3>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700">5/5</span>
              <span className="font-bold text-slate-900">0</span>
            </div>
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
              <tr className="hover:bg-slate-50">
                <td className="py-1.5 px-3 font-medium text-slate-800">Fantastyka</td>
                <td className="py-1.5 px-3 text-right font-bold text-indigo-600">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tabelka z książkami */}
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
                <th className="py-2 px-2.5 font-semibold text-right">Strony</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-1.5 px-2.5 text-center text-slate-400 font-medium">1</td>
                <td className="py-1.5 px-2.5 font-semibold text-slate-900">Przykładowy Tytuł</td>
                <td className="py-1.5 px-2.5 text-slate-700">Jan Kowalski</td>
                <td className="py-1.5 px-2.5 text-slate-500">-</td>
                <td className="py-1.5 px-2.5 text-slate-600">Papier</td>
                <td className="py-1.5 px-2.5 text-center font-bold text-slate-800">5.0</td>
                <td className="py-1.5 px-2.5 text-slate-600">Fantastyka</td>
                <td className="py-1.5 px-2.5 text-right font-medium text-slate-900">350</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}