import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Tabela główna książek
export const ksiazki = sqliteTable("ksiazki", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  autor: text("autor"),
  tytul: text("tytul"),
  formatKsiazki: text("format_ksiazki"),
  jednotomowka: integer("jednotomowka", { mode: "boolean" }),
  nazwaSerii: text("nazwa_serii"),
  ocena: text("ocena"),
  przeczytanoW: text("przeczytano_w"),
  strony: integer("strony"),
});

// Słownik gatunków
export const gatunki = sqliteTable("gatunki", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nazwa: text("nazwa").notNull().unique(),
});

// Tabela łącząca (relacja wiele-do-wielu)
export const ksiazkiGatunki = sqliteTable("ksiazki_gatunki", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ksiazkaId: integer("ksiazka_id")
    .notNull()
    .references(() => ksiazki.id, { onDelete: "cascade" }),
  gatunekId: integer("gatunek_id")
    .notNull()
    .references(() => gatunki.id, { onDelete: "cascade" }),
});