'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/cepalab/dashboard/enhanced", label: "Dashboard" },
  { href: "/cepalab/relatorios", label: "Relatórios" },
  { href: "/cepalab/vendas", label: "Vendas" },
  { href: "/cepalab/estoque", label: "Estoque" },
  { href: "/cepalab/financeiro", label: "Financeiro" },
  { href: "/auth/login", label: "Autenticação" }
];

export function Menu() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {items.map((i) => {
        const active = pathname === i.href;
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 dark:hover:bg-gray-700 transition ${active ? "bg-primary/15 text-primary glow-border" : "text-foreground dark:text-gray-200"}`}
          >
            <span>{i.label}</span>
            {active && <span className="text-xs">ativo</span>}
          </Link>
        );
      })}
    </nav>
  );
}