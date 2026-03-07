import { RefObject } from "react";
import { toPng } from "html-to-image";

export const exportarPNG = async <T extends HTMLElement>(
  ref: RefObject<T | null>,
  fileName = "grafico.png"
) => {
  if (!ref.current) return;

  try {
    const dataUrl = await toPng(ref.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Erro ao exportar gráfico:", error);
  }
};