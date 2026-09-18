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
          height: 1123,
        });

        const dokumentPdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const daneObrazu = pototokCanvas.toDataURL("image/png");
        dokumentPdf.addImage(daneObrazu, "PNG", 0, 0, 210, 297);

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