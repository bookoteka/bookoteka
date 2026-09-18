// Obsługa raportów

import { appDataDir, BaseDirectory, join } from '@tauri-apps/api/path';
import { mkdir, exists, readDir, remove, copyFile, writeFile } from '@tauri-apps/plugin-fs';
import { convertFileSrc } from '@tauri-apps/api/core';


export interface RaportPlik {
  nazwa: string;
  sciezka: string;
  urlWebview: string;
}

export async function pobierzFolderRaportow(): Promise<string> {
  const sciezkaAppData = await appDataDir();
  const sciezkaRaporty = await join(sciezkaAppData, 'raporty');

  const czyIstnieje = await exists(sciezkaRaporty);
  if (!czyIstnieje) {
    await mkdir(sciezkaRaporty, { recursive: true });
  }

  return sciezkaRaporty;
}

export async function pobierzListeRaportow(): Promise<RaportPlik[]> {
  const folderRaporty = await pobierzFolderRaportow();
  const wpisy = await readDir(folderRaporty);

  const listaRaportow: RaportPlik[] = [];

  for (const wpis of wpisy) {
    if (wpis.isFile && wpis.name.endsWith('.pdf')) {
      const pelnaSciezka = await join(folderRaporty, wpis.name);
      listaRaportow.push({
        nazwa: wpis.name,
        sciezka: pelnaSciezka,
        urlWebview: convertFileSrc(pelnaSciezka)
      });
    }
  }

  return listaRaportow;
}

export async function usunRaport(nazwaPliku: string): Promise<void> {
  const folderRaporty = await pobierzFolderRaportow();
  const sciezkaDoUsuwania = await join(folderRaporty, nazwaPliku);
  
  const czyIstnieje = await exists(sciezkaDoUsuwania);
  if (czyIstnieje) {
    await remove(sciezkaDoUsuwania);
  }
}

export async function pobierzRaportDoPobrane(nazwaPliku: string): Promise<string> {
  const folderAplikacji = await pobierzFolderRaportow();
  const zrodloSciezka = await join(folderAplikacji, nazwaPliku);

  await copyFile(zrodloSciezka, nazwaPliku, {
    toPathBaseDir: BaseDirectory.Download
  });

  return nazwaPliku;
}

export async function zapiszRaportPdf(nazwaPliku: string, daneZawartosc: Uint8Array): Promise<string> {
  const folderRaporty = await pobierzFolderRaportow();
  const pelnaSciezka = await join(folderRaporty, nazwaPliku);

  await writeFile(pelnaSciezka, daneZawartosc);

  return pelnaSciezka;
}