import Database from "@tauri-apps/plugin-sql";

export async function zainicjalizujBaze() {
  const baza = await Database.load("sqlite:bookoteka.db");

  // 1. Tabela książek
  await baza.execute(`
    CREATE TABLE IF NOT EXISTS ksiazki (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      autor TEXT,
      tytul TEXT,
      format_ksiazki TEXT,
      jednotomowka BOOLEAN,
      nazwa_serii TEXT,
      ocena TEXT,
      przeczytano_w TEXT,
      strony INTEGER
    );
  `);

  // 2. Tabela gatunków
  await baza.execute(`
    CREATE TABLE IF NOT EXISTS gatunki (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nazwa TEXT NOT NULL
    );
  `);

  // 3. Tabela łącząca (relacja wiele-do-wielu)
  await baza.execute(`
    CREATE TABLE IF NOT EXISTS ksiazki_gatunki (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ksiazka_id INTEGER NOT NULL,
      gatunek_id INTEGER NOT NULL,
      FOREIGN KEY (ksiazka_id) REFERENCES ksiazki(id) ON DELETE CASCADE,
      FOREIGN KEY (gatunek_id) REFERENCES gatunki(id) ON DELETE CASCADE
    );
  `);

  // 4. Wstępne zasilenie słownika gatunków (jeśli pusta)
  const dotychczasoweGatunki = await baza.select<unknown[]>("SELECT * FROM gatunki");
  if (dotychczasoweGatunki.length === 0) {
    await baza.execute(`
      INSERT INTO gatunki (nazwa) VALUES 
        ('Science-fiction'),
        ('Fantastyka'),
        ('Przygodowa'),
        ('Komedia'),
        ('Kryminał'),
        ('Romans'),
        ('Obyczaj'),
        ('Fanfik'),
        ('Inne');
    `);
  }
}