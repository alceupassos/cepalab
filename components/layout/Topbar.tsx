import Link from "next/link";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Moon, Sun } from "lucide-react";

export function Topbar() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <header className="flex items-center justify-between border-b border-muted/60 px-6 py-3">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Visão geral do ERP ULTRA
        </p>
        <h2 className="text-sm font-medium text-foreground">
          Mapa funcional, vulnerabilidades e KPIs do banco SQL Server
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:shadow-inner transform hover:scale-105 active:scale-95
                     bg-gray-100 dark:bg-gray-800 
                     hover:bg-gray-200 dark:hover:bg-gray-700 
                     border border-gray-200 dark:border-gray-700
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          title={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-yellow-500 drop-shadow-sm" />
          ) : (
            <Moon className="h-4 w-4 text-gray-600 drop-shadow-sm" />
          )}
        </button>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary glow-border">
          Angra DB Manager · Inteligência de Vulnerabilidades & KPIs
        </span>
        <Link href="/cepalab" className="px-3 py-1 rounded glow-border text-xs bg-primary text-primary-foreground">
          MicroSaaS CEPALAB
        </Link>
      </div>
    </header>
  );
}
