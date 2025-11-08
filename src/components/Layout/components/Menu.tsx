import { LayoutDashboardIcon, Menu, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

export const MenuComponent = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const menuItems = [
    {
      label: "Descrição por Período",
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
      link: "describe-by-period",
    },
    {
      label: "Distribuição de Atividades",
      icon: <Users className="h-4 w-4" />,
      link: "activities-distribution",
    },
  ];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className="flex items-center space-x-3">
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu className="h-5 w-5" />
        </button>

        {open && (
          <div
            ref={panelRef}
            className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg"
          >
            <ul className="py-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.link}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors text-nowrap ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
