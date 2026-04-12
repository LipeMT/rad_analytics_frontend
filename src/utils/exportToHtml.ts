import { RefObject } from "react";

function getPageStyles() {
    return Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
        .map((node) => node.outerHTML)
        .join("");
}

function cloneWithVisibleOverflow<T extends HTMLElement>(element: T): T {
    const clone = element.cloneNode(true) as T;
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT, null);

    const applyStyle = (el: HTMLElement) => {
        el.style.overflow = "visible";
        el.style.overflowX = "visible";
        el.style.overflowY = "visible";
        el.style.maxHeight = "none";
        el.style.maxWidth = "none";
        el.style.position = "static";
    };

    applyStyle(clone as unknown as HTMLElement);

    while (walker.nextNode()) {
        const node = walker.currentNode as HTMLElement;
        if (node?.style) {
            applyStyle(node);
        }
    }

    return clone;
}

export const exportarHTML = async <T extends HTMLElement>(ref: RefObject<T | null>, fileName = "tabela.html") => {
    if (!ref.current) return;

    const css = getPageStyles();
    const clonedElement = cloneWithVisibleOverflow(ref.current);

    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${fileName}</title>${css}<style>body{font-family:system-ui, sans-serif;padding:24px;background:#f8fafc;color:#111;margin:0;}*{overflow:visible !important;max-width:none !important;max-height:none !important;}table{width:100% !important;border-collapse:collapse !important;margin:0 auto 24px !important;}th,td{border:1px solid #d1d5db !important;padding:12px 10px !important;text-align:left !important;}th{background:#f3f4f6 !important;color:#111 !important;font-weight:700 !important;}tbody tr:nth-child(even){background:#f9fafb !important;}</style></head><body>${clonedElement.outerHTML}</body></html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};
