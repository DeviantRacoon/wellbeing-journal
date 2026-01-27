"use client";

import {
  Hexagon,
  LayoutDashboard,
  LogOut,
  Package,
  PersonStanding,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/commons/libs/cn";
import { ScrollArea } from "./scroll-area";

export const sidebarItems = [
  { name: "Dashboard", href: "/admin/", icon: LayoutDashboard },
  { name: "Usuarios", href: "/admin/users", icon: Users },
  { name: "Compras", href: "/admin/purchases", icon: ShoppingCart },
  { name: "Clientes", href: "/admin/customers", icon: PersonStanding },
  { name: "Categorías", href: "/admin/categories", icon: Tag },
  { name: "Productos", href: "/admin/products", icon: Package },
  { name: "Configuraciones", href: "/admin/settings", icon: Settings },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-xl transition-all duration-300",
        className
      )}
    >
      <div className="flex h-20 items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-500 blur-[10px] opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-lg" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 shadow-inner text-indigo-400 group-hover:text-white group-hover:scale-105 transition-all duration-300">
              <Hexagon className="h-6 w-6" strokeWidth={1.5} />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-none">
              Nexus<span className="text-indigo-400">Admin</span>
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
              v2.4.0
            </span>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="flex flex-col gap-1">
          <p className="px-4 text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-2">
            Main Menu
          </p>

          <nav className="flex flex-col gap-1">
            {sidebarItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "text-white shadow-lg shadow-indigo-500/10" // Active Text
                      : "text-slate-400 hover:text-white hover:bg-white/5" // Inactive
                  )}
                >
                  {/* Fondo Activo (Condicional) */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600/20 to-violet-600/10 border border-indigo-500/20" />
                  )}

                  {/* Icono */}
                  <item.icon
                    className={cn(
                      "relative z-10 h-5 w-5 transition-colors duration-300",
                      isActive
                        ? "text-indigo-400"
                        : "text-slate-500 group-hover:text-indigo-300"
                    )}
                  />

                  {/* Texto */}
                  <span className="relative z-10">{item.name}</span>

                  {/* Indicador de "Activo" (pequeña barra brillante a la derecha) - Opcional */}
                  {isActive && (
                    <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </ScrollArea>

      <div className="mt-auto p-4 border-t border-white/5">
        <button
          onClick={() => signOut()}
          className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
