import React, { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

interface Campus {
  sigla: string;
  nome: string;
}

export const CAMPI: Campus[] = [
  { sigla: "REITORIA", nome: "Reitoria – IF Goiano" },
  { sigla: "CMPRV", nome: "Campus Rio Verde" },
  { sigla: "CMPIPR", nome: "Campus Iporá" },
  { sigla: "CMPURT", nome: "Campus Urutaí" },
  { sigla: "CMPMHOS", nome: "Campus Morrinhos" },
  { sigla: "CMPCE", nome: "Campus Ceres" },
  { sigla: "CMPTRI", nome: "Campus Trindade" },
  { sigla: "CMPPOS", nome: "Campus Posse" },
  { sigla: "CMPCBE", nome: "Campus Campos Belos" },
  { sigla: "CMPIPA", nome: "Campus Ipameri" },
  { sigla: "CMPHID", nome: "Campus Hidrolândia" },
  { sigla: "CMPACAT", nome: "Campus Catalão" },
  { sigla: "CMPCRIS", nome: "Campus Cristalina" }
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

interface AutocompleteCampusProps {
  value: string;
  onChange: (sigla: string) => void;
  placeholder?: string;
  label?: string;
}

export const AutocompleteCampus: React.FC<AutocompleteCampusProps> = ({
  value,
  onChange,
  placeholder = "Selecione um campus...",
  label = "Campus",
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const c = CAMPI.find((c) => c.sigla === value);
    if (c && !open) setQuery(`${c.nome} (${c.sigla})`);
    if (!value && !open) setQuery("");
  }, [value, open]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!open) return;
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return CAMPI;
    return CAMPI.filter((c) => {
      const alvo = `${c.nome} ${c.sigla}`;
      return normalize(alvo).includes(q);
    });
  }, [query]);

  function select(c: Campus) {
    onChange(c.sigla);
    setOpen(false);
    setQuery(`${c.nome} (${c.sigla})`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      setHighlight(0);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
      scrollHighlightedIntoView(highlight + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
      scrollHighlightedIntoView(highlight - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[highlight];
      if (item) select(item);
    }
  }

  function scrollHighlightedIntoView(idx: number) {
    const list = listRef.current;
    if (!list) return;
    const el = list.children.item(idx) as HTMLElement | null;
    if (el) el.scrollIntoView({ block: "nearest" });
  }

  function clear() {
    setQuery("");
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div ref={rootRef} className="w-full">
      {label && (
        <label className="mb-1 block text-xs font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-controls="campus-listbox"
          aria-autocomplete="list"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-9 text-sm outline-none placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />

        {query && (
          <button
            aria-label="Limpar"
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {open && (
          <ul
            ref={listRef}
            id="campus-listbox"
            role="listbox"
            className="absolute z-50 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
          >
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">
                Nenhum campus encontrado
              </li>
            )}

            {filtered.map((c, i) => (
              <li key={c.sigla} role="option" aria-selected={i === highlight}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => select(c)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors
                    ${i === highlight ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}
                  `}
                >
                  <span className="inline-flex h-2 w-2 rounded-full bg-gray-300" />
                  <span className="flex-1">
                    {c.nome} <span className="text-gray-500">({c.sigla})</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
