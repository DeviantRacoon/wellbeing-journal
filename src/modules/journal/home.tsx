import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/commons/components";

import { BottomNav } from "@/commons/components/layout/bottom-nav";
import { Avatar, AvatarFallback } from "@/commons/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/commons/components/ui/dropdown-menu";
import { ArrowRight, Calendar, LogOut, Sparkles } from "lucide-react";

import Layout from "./components/layout";
import useJournalHistory from "./history/useJournalHistory";

export default function Home() {
  const { entries } = useJournalHistory();
  const lastEntry = entries[0];

  return (
    <Layout>
      <header className="relative z-10 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Hola, Viajero.
          </h1>
          <p className="text-sm text-slate-400">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent"
            >
              <Avatar className="h-10 w-10 border-2 border-indigo-500/50 hover:border-indigo-400 transition-colors">
                <AvatarFallback className="bg-slate-900 text-white font-bold text-xs">
                  YO
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-slate-950 border-white/10 text-white"
          >
            <DropdownMenuItem
              className="text-red-400 focus:text-red-300 focus:bg-white/10 cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex-1 px-6 space-y-8 relative z-10 max-w-xl mx-auto w-full">
        {/* HERO CARD - NEW ENTRY */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-8 text-center shadow-2xl backdrop-blur-xl group">
          <div className="absolute inset-0 bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />

          <div className="relative z-10 space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
              <Sparkles className="w-8 h-8 text-indigo-300" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                ¿Cómo te sientes hoy?
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Tomar un momento para escribir despeja la mente y calma el alma.
              </p>
            </div>

            <Button
              asChild
              className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90 font-bold shadow-lg shadow-white/10"
            >
              <Link href="/journal">
                Escribir en mi Bitácora <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* RECENT ACTIVITY PREVIEW */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/40">
              Reciente
            </h3>
            <Link
              href="/journal/history"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              Ver todo
            </Link>
          </div>

          {lastEntry ? (
            <Link href="/journal/history">
              <article className="rounded-2xl border border-white/5 bg-white/5 p-5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-3 text-xs text-white/40">
                  <Calendar className="w-3 h-3" />
                  <span className="capitalize">
                    {format(parseISO(lastEntry.createdAt!), "eee, d", {
                      locale: es,
                    })}
                  </span>
                </div>
                <p className="text-sm text-white/80 line-clamp-2 italic">
                  "{lastEntry.content}"
                </p>
              </article>
            </Link>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 text-white/20 text-sm">
              Aún no hay entradas.
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </Layout>
  );
}
