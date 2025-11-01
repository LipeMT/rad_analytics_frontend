import { BarChart3, Bell, FileText, LayoutDashboard, Menu, Settings, User, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Descrição por Período");
  const panelRef = useRef<HTMLDivElement | null>(null);

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

  const menuItems = [
    { label: "Descrição por Período", icon: <LayoutDashboard className="h-4 w-4" />, navigate: "describe_by_period" },
    { label: "Servidores", icon: <Users className="h-4 w-4" /> },
    { label: "Relatórios", icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">RAD Analytics</h1>
              </div>
            </div>

          <div className="flex items-center space-x-3">
            {/* Botão do menu suspenso */}
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
                    {menuItems.map((item) => {
                      const active = selected === item.label;
                      return (
                        <li key={item.label}>
                          <button
                            onClick={() => {
                              setSelected(item.label);
                              setOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors
                              ${
                                active
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {item.icon}
                            {item.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Ações do header */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
