import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { zainicjalizujBaze } from "./db/migracje";

// Importy stron
import Glowna from "./pages/Glowna";
import Dodaj from "./pages/Dodaj";
import WidokKsiazki from "./pages/WidokKsiazki";
import Edytuj from "./pages/Edytuj";
import Raporty from "./pages/Raporty";
import WidokRaportu from "./pages/WidokRaportu";
import Ustawienia from "./pages/Ustawienia";

export default function App() {
  useEffect(() => {
    zainicjalizujBaze()
      .then(() => console.log("Baza danych inicjalizowana pomyślnie!"))
      .catch((err) => console.error("Błąd inicjalizacji bazy:", err));
  }, []);
  return (
    <MemoryRouter initialEntries={["/"]}>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Routes>
          <Route path="/" element={<Glowna />} />
          <Route path="/dodaj" element={<Dodaj />} />
          <Route path="/ksiazka/:id" element={<WidokKsiazki />} />
          <Route path="/ksiazka/:id/edytuj" element={<Edytuj />} />
          <Route path="/raporty" element={<Raporty />} />
          <Route path="/raporty/:id" element={<WidokRaportu />} />
          <Route path="/ustawienia" element={<Ustawienia />} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}