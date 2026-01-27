"use client"

import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-950 text-slate-200 selection:bg-indigo-500/30">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-indigo-600/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[100px]" />
      </div>

      <aside className="relative z-20 hidden w-[260px] flex-col border-r border-white/5 bg-slate-950/40 backdrop-blur-xl md:flex">
        <Sidebar className="border-none bg-transparent" />
      </aside>

      <div className="relative z-10 flex flex-1 flex-col min-w-0">

        <Navbar />

        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
          <div className="mx-auto p-6 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}