// Generowanie raportów

import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { zapiszRaportPdf } from "./raporty";

export async function wygenerujRaportPdf(
  komponentSzablonu: React.ReactNode, 
  nazwaPliku: string
): Promise<string> {
  const kontenerUkryty = document.createElement("div");
  kontenerUkryty.style.position = "absolute";
  kontenerUkryty.style.left = "-9999px";
  kontenerUkryty.style.top = "-9999px";
  document.body.appendChild(kontenerUkryty);

  const korzen = createRoot(kontenerUkryty);

  return new Promise((resolve, reject) => {
    korzen.render(komponentSzablonu);

    setTimeout(async () => {
      try {
        const element = kontenerUkryty.firstElementChild as HTMLElement;

        const pototokCanvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: 794,
        });

        const dokumentPdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const szerokoscStronyMm = 210;
        const wysokoscStronyMm = 297;
        const wysokoscStronyPx =
          pototokCanvas.width * (wysokoscStronyMm / szerokoscStronyMm);
        const skalaX = pototokCanvas.width / element.getBoundingClientRect().width;
        const graniceWierszy = Array.from(element.querySelectorAll("tr"))
          .map((wiersz) => {
            const prostokat = wiersz.getBoundingClientRect();
            const polozenieWzgledemRaportu =
              prostokat.bottom - element.getBoundingClientRect().top;
            return polozenieWzgledemRaportu * skalaX;
          })
          .filter((granica) => granica > 0 && granica < pototokCanvas.height)
          .sort((a, b) => a - b);

        let poczatekStronyPx = 0;
        let numerStrony = 0;

        while (poczatekStronyPx < pototokCanvas.height) {
          const docelowaGranicaPx = Math.min(
            poczatekStronyPx + wysokoscStronyPx,
            pototokCanvas.height,
          );
          const ostatniaGranicaWiersza = graniceWierszy
            .filter(
              (granica) =>
                granica > poczatekStronyPx + 1 && granica <= docelowaGranicaPx,
            )
            .pop();
          const koniecStronyPx =
            docelowaGranicaPx < pototokCanvas.height &&
            ostatniaGranicaWiersza !== undefined
              ? ostatniaGranicaWiersza
              : docelowaGranicaPx;
          const wysokoscFragmentuPx = koniecStronyPx - poczatekStronyPx;
          const fragmentCanvas = document.createElement("canvas");
          fragmentCanvas.width = pototokCanvas.width;
          fragmentCanvas.height = wysokoscFragmentuPx;

          const kontekst = fragmentCanvas.getContext("2d");
          if (!kontekst) {
            throw new Error("Nie udało się utworzyć kontekstu canvas dla strony PDF.");
          }

          kontekst.fillStyle = "#ffffff";
          kontekst.fillRect(0, 0, fragmentCanvas.width, fragmentCanvas.height);
          kontekst.drawImage(
            pototokCanvas,
            0,
            poczatekStronyPx,
            pototokCanvas.width,
            wysokoscFragmentuPx,
            0,
            0,
            fragmentCanvas.width,
            fragmentCanvas.height,
          );

          if (numerStrony > 0) {
            dokumentPdf.addPage();
          }

          dokumentPdf.addImage(
            fragmentCanvas.toDataURL("image/png"),
            "PNG",
            0,
            0,
            szerokoscStronyMm,
            wysokoscFragmentuPx / pototokCanvas.width * szerokoscStronyMm,
          );

          poczatekStronyPx = koniecStronyPx;
          numerStrony += 1;
        }

        const bajty = new Uint8Array(dokumentPdf.output("arraybuffer"));
        const sciezkaPliku = await zapiszRaportPdf(nazwaPliku, bajty);

        resolve(sciezkaPliku);
      } catch (blad) {
        reject(blad);
      } finally {
        korzen.unmount();
        document.body.removeChild(kontenerUkryty);
      }
    }, 300);
  });
}