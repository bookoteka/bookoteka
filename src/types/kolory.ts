// Paleta kolorów

export interface PaletaKoloru {
  id: string;
  nazwa: string;
  odcien: string;
  kodHex: string;
  koloryWykresu: [string, string, string, string];
}

export const DOSTEPNE_KOLORY: PaletaKoloru[] = [
  // Fiolety i odcienie niebieskiego
  {
    id: "indigo",
    nazwa: "Indygo",
    odcien: "239",
    kodHex: "#4f46e5",
    koloryWykresu: ["#4f46e5", "#818cf8", "#3730a3", "#c7d2fe"],
  },
  {
    id: "blue",
    nazwa: "Niebieski",
    odcien: "217",
    kodHex: "#2563eb",
    koloryWykresu: ["#2563eb", "#60a5fa", "#1e40af", "#bfdbfe"],
  },
  {
    id: "sky",
    nazwa: "Błękitny",
    odcien: "199",
    kodHex: "#0284c7",
    koloryWykresu: ["#0284c7", "#38bdf8", "#075985", "#bae6fd"],
  },
  {
    id: "cyan",
    nazwa: "Cyjan",
    odcien: "188",
    kodHex: "#0891b2",
    koloryWykresu: ["#0891b2", "#22d3ee", "#155e75", "#cffafe"],
  },
  {
    id: "violet",
    nazwa: "Fioletowy",
    odcien: "263",
    kodHex: "#7c3aed",
    koloryWykresu: ["#7c3aed", "#a78bfa", "#5b21b6", "#ddd6fe"],
  },
  {
    id: "purple",
    nazwa: "Purpurowy",
    odcien: "271",
    kodHex: "#9333ea",
    koloryWykresu: ["#9333ea", "#c084fc", "#6b21a8", "#f3e8ff"],
  },
  {
    id: "fuchsia",
    nazwa: "Fuksja",
    odcien: "292",
    kodHex: "#c026d3",
    koloryWykresu: ["#c026d3", "#e879f9", "#86198f", "#fae8ff"],
  },
  {
    id: "pink",
    nazwa: "Różowy",
    odcien: "330",
    kodHex: "#db2777",
    koloryWykresu: ["#db2777", "#f472b6", "#9d174d", "#fce7f3"],
  },
  {
    id: "rose",
    nazwa: "Różany",
    odcien: "343",
    kodHex: "#e11d48",
    koloryWykresu: ["#e11d48", "#fb7185", "#9f1239", "#ffe4e6"],
  },

  // Zielenie i morskie
  {
    id: "emerald",
    nazwa: "Szmaragdowy",
    odcien: "160",
    kodHex: "#059669",
    koloryWykresu: ["#059669", "#34d399", "#065f46", "#a7f3d0"],
  },
  {
    id: "teal",
    nazwa: "Morski",
    odcien: "173",
    kodHex: "#0d9488",
    koloryWykresu: ["#0d9488", "#2dd4bf", "#115e59", "#99f6e4"],
  },
  {
    id: "green",
    nazwa: "Zielony",
    odcien: "142",
    kodHex: "#16a34a",
    koloryWykresu: ["#16a34a", "#4ade80", "#166534", "#bbf7d0"],
  },
  {
    id: "lime",
    nazwa: "Limonkowy",
    odcien: "84",
    kodHex: "#65a30d",
    koloryWykresu: ["#65a30d", "#a3e635", "#3f6212", "#d9f99d"],
  },

  // Ciepłe
  {
    id: "red",
    nazwa: "Czerwony",
    odcien: "0",
    kodHex: "#dc2626",
    koloryWykresu: ["#dc2626", "#f87171", "#991b1b", "#fecaca"],
  },
  {
    id: "orange",
    nazwa: "Pomarańczowy",
    odcien: "24",
    kodHex: "#ea580c",
    koloryWykresu: ["#ea580c", "#fb923c", "#9a3412", "#ffedd5"],
  },
  {
    id: "amber",
    nazwa: "Bursztynowy",
    odcien: "38",
    kodHex: "#d97706",
    koloryWykresu: ["#d97706", "#fbbf24", "#92400e", "#fef3c7"],
  },
  {
    id: "yellow",
    nazwa: "Żółty",
    odcien: "48",
    kodHex: "#ca8a04",
    koloryWykresu: ["#ca8a04", "#facc15", "#854d0e", "#fef9c3"],
  },

  // Neutralne i szarości
  {
    id: "slate",
    nazwa: "Łupkowy",
    odcien: "215",
    kodHex: "#475569",
    koloryWykresu: ["#475569", "#94a3b8", "#1e293b", "#e2e8f0"],
  },
  {
    id: "zinc",
    nazwa: "Cynkowy",
    odcien: "240",
    kodHex: "#52525b",
    koloryWykresu: ["#52525b", "#a1a1aa", "#27272a", "#e4e4e7"],
  },
  {
    id: "stone",
    nazwa: "Kamienny",
    odcien: "25",
    kodHex: "#57534e",
    koloryWykresu: ["#57534e", "#a8a29e", "#292524", "#e7e5e4"],
  },
];