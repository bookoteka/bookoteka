// Paleta kolorów

export interface PaletaKoloru {
  id: string;
  nazwa: string;
  odcien: string;
  kodHex: string;
}

export const DOSTEPNE_KOLORY: PaletaKoloru[] = [
  // Fiolety i odcienie niebieskiego
  { id: "indigo", nazwa: "Indygo", odcien: "239", kodHex: "#4f46e5" },
  { id: "blue", nazwa: "Niebieski", odcien: "217", kodHex: "#2563eb" },
  { id: "sky", nazwa: "Błękitny", odcien: "199", kodHex: "#0284c7" },
  { id: "cyan", nazwa: "Cyjan", odcien: "188", kodHex: "#0891b2" },
  { id: "violet", nazwa: "Fioletowy", odcien: "263", kodHex: "#7c3aed" },
  { id: "purple", nazwa: "Purpurowy", odcien: "271", kodHex: "#9333ea" },
  { id: "fuchsia", nazwa: "Fuksja", odcien: "292", kodHex: "#c026d3" },
  { id: "pink", nazwa: "Różowy", odcien: "330", kodHex: "#db2777" },
  { id: "rose", nazwa: "Różany", odcien: "343", kodHex: "#e11d48" },

  // Zielenie i morskie
  { id: "emerald", nazwa: "Szmaragdowy", odcien: "160", kodHex: "#059669" },
  { id: "teal", nazwa: "Morski", odcien: "173", kodHex: "#0d9488" },
  { id: "green", nazwa: "Zielony", odcien: "142", kodHex: "#16a34a" },
  { id: "lime", nazwa: "Limonkowy", odcien: "84", kodHex: "#65a30d" },

  // Ciepłe
  { id: "red", nazwa: "Czerwony", odcien: "0", kodHex: "#dc2626" },
  { id: "orange", nazwa: "Pomarańczowy", odcien: "24", kodHex: "#ea580c" },
  { id: "amber", nazwa: "Bursztynowy", odcien: "38", kodHex: "#d97706" },
  { id: "yellow", nazwa: "Żółty", odcien: "48", kodHex: "#ca8a04" },

  // Neutralne i szarości
  { id: "slate", nazwa: "Łupkowy", odcien: "215", kodHex: "#475569" },
  { id: "zinc", nazwa: "Cynkowy", odcien: "240", kodHex: "#52525b" },
  { id: "stone", nazwa: "Kamienny", odcien: "25", kodHex: "#57534e" },
];