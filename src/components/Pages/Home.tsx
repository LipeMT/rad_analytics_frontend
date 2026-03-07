import { BarChart, Calendar, CalendarDays, GraduationCap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const pages = [
    {
      title: "Descrição por Período",
      description: "Visualize descrições detalhadas das atividades por período específico.",
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      link: "describe-by-period",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    },
    {
      title: "Distribuição de Atividades",
      description: "Analise a distribuição das atividades de forma gráfica e intuitiva.",
      icon: <BarChart className="h-8 w-8 text-green-600" />,
      link: "activities-distribution",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
    },
    {
      title: "Atividades por Período",
      description: "Explore as atividades organizadas por diferentes períodos de tempo.",
      icon: <CalendarDays className="h-8 w-8 text-purple-600" />,
      link: "activities-by-period",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    },
    {
      title: "Variação de Atividades",
      description: "Observe as variações e tendências nas atividades ao longo do tempo.",
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      link: "activity-variation",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
    },
    {
      title: "Docentes por Atividade",
      description: "Veja a relação entre docentes e suas respectivas atividades.",
      icon: <GraduationCap className="h-8 w-8 text-red-600" />,
      link: "docents_by_activity",
      color: "bg-red-50 hover:bg-red-100 border-red-200",
    },
  ];

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dashboard de Atividades
          </h1>
          <p className="text-xl text-gray-600">
            Explore diferentes visualizações e análises das atividades acadêmicas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pages.map((page, index) => (
            <Link
              key={index}
              to={page.link}
              className={`block p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${page.color}`}
            >
              <div className="flex items-center mb-4">
                {page.icon}
                <h2 className="ml-4 text-2xl font-semibold text-gray-800">
                  {page.title}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {page.description}
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-gray-700">
                Explorar
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
