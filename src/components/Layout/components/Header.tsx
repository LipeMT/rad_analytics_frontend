import { BarChart3 } from "lucide-react";
import { MenuComponent } from "./Menu";

export const Header = () => {

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
          <MenuComponent />
        </div>
      </div>
    </header>
  );
};
