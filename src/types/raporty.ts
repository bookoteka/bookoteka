// Typy dla raportów czytelniczych (PDF / Widok)

export interface KsiazkaRaportu {
  lp: number;
  tytul: string;
  autor: string;
  seria?: string;
  format: string;
  ocena: string | number;
  gatunki: string;
  miesiac?: string;
  strony: number;
}

export interface StatystykiGatunku {
  gatunek: string;
  liczba: number;
}

export interface DaneRaportuMiesiac {
  naglowek: string;
  przeczytaneKsiazki: number;
  przeczytaneStrony: number;
  formaty: { 
    papier: number; 
    ebook: number; 
    audiobook: number; 
    synchrobook: number 
  };
  oceny: Record<number, number>;
  gatunki: StatystykiGatunku[];
  ksiazki: KsiazkaRaportu[];
}

export interface DaneRaportuRok extends DaneRaportuMiesiac {
  rok: string;
}