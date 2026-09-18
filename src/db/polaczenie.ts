import Database from "@tauri-apps/plugin-sql";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schemat from "./schemat";

const bazaTauri = await Database.load("sqlite:bookoteka.db");

export const baza = drizzle(
  async (zapytanie, parametry, metoda) => {
    try {
      if (metoda === "run") {
        await bazaTauri.execute(zapytanie, parametry);
        return { rows: [] };
      }
      
      const wiersze = await bazaTauri.select<Record<string, unknown>[]>(
        zapytanie,
        parametry
      );
      
      return { rows: wiersze.map((wiersz) => Object.values(wiersz)) };
    } catch (blad) {
      console.error("Błąd zapytania SQL:", blad);
      throw blad;
    }
  },
  { schema: schemat }
);