export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="fixed inset-0 h-[100dvh] w-full bg-slate-950 text-white flex flex-col overflow-hidden font-sans selection:bg-indigo-500/30 overscroll-none touch-none">
      <div className="absolute -top-[20%] -left-[10%] h-125 w-125 rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] -right-[10%] h-100 w-100 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      {children}
    </section>
  );
}
