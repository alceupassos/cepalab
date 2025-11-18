import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Menu } from "@/components/layout/Menu";

export default function CepalabLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[320px_1fr] dark:bg-gray-900">
      <Sidebar>
        <Menu />
      </Sidebar>
      <div className="flex flex-col dark:bg-gray-900">
        <Topbar />
        <main className="p-6 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
}