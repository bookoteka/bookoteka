import { MemoryRouter, Routes, Route } from "react-router-dom";

// Importy stron
import Glowna from "./pages/Glowna";
import Dodaj from "./pages/Dodaj";
import { useEffect } from "react";
import { zainicjalizujBaze } from "./db/migracje";

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
        </Routes>
      </div>
    </MemoryRouter>
  );
}