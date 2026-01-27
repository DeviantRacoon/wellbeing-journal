import Link from "next/link";

import {
  AlignLeft,
  ArrowLeft,
  ArrowRight,
  Battery,
  Brain,
  ChevronLeft,
  Moon,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Slider,
} from "@/commons/components";

import Layout from "../journal/components/layout";

import { cn } from "@/commons/libs/cn";
import { SLEEP_HOURS, SOCIAL_BATTERY } from "@/commons/libs/constants";

import MoodSelector from "./components/mood-selector";
import useJournal from "./useJournal";

export default function Journal() {
  const {
    step,
    isSheetOpen,
    sheetPhase,
    entry,
    handleContentChange,
    startReflection,
    submitEntry,
    getFocusLabel,
    setSheetPhase,
    setEntry,
    setIsSheetOpen,
  } = useJournal();

  return (
    <Layout>
      <header className="relative z-10 flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-xl h-10 w-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
        >
          <Link href="/">
            <ArrowLeft className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
          </Link>
        </Button>

        <div className="text-xs uppercase tracking-wider font-semibold text-white/50">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
          })}
        </div>
        <div className="w-10" />
      </header>

      <main
        className={cn(
          "flex-1 flex flex-col px-4 pb-24 relative z-10 transition-all duration-500 max-w-xl mx-auto w-full",
          step === "feedback"
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100",
        )}
      >
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Bitácora Diaria
          </h1>
          <p className="text-sm text-slate-400">
            Vacía tu mente antes de analizar tu día.
          </p>
        </div>

        <div className="flex-1 relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-1 shadow-2xl backdrop-blur-xl">
          <div className="flex-1 flex flex-col p-4 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs uppercase tracking-wider font-semibold text-white/50 ml-1 flex items-center gap-2">
                <AlignLeft className="w-3 h-3" /> Entrada de Texto
              </label>
            </div>

            <textarea
              value={entry.content}
              onChange={handleContentChange}
              placeholder="¿Qué tienes en mente hoy?"
              className={cn(
                "flex-1 w-full bg-slate-950/30 rounded-xl border border-white/10 p-4 text-sm text-white placeholder:text-white/20 resize-none outline-none transition-all",
                "focus:border-indigo-500/50 focus:bg-slate-950/50 focus:ring-1 focus:ring-indigo-500/50",
                "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
              )}
              autoFocus
            />
          </div>

          <div className="p-4 border-t border-white/5">
            <Button
              onClick={startReflection}
              className={cn(
                "w-full h-12 rounded-xl font-medium transition-all shadow-lg",
                "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20",
              )}
              disabled={entry.content.trim().length === 0}
            >
              Comenzar Análisis <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          className="border-t border-white/10 bg-slate-950 shadow-2xl p-0 max-h-[90vh] flex flex-col"
        >
          {/* HEADER CON BARRA DE PROGRESO */}
          <SheetHeader className="px-6 pt-6 pb-4 text-left border-b border-white/5 bg-white/5 relative">
            {/* Barra de Progreso Sutil */}
            <div
              className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-500"
              style={{ width: sheetPhase === 1 ? "50%" : "100%" }}
            />

            <div className="flex justify-between items-center mb-1">
              <SheetTitle className="text-lg font-bold text-white flex items-center gap-2">
                {sheetPhase === 1 ? (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" /> Energía Física
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" /> Estado Mental
                  </span>
                )}
              </SheetTitle>
            </div>
            <SheetDescription className="text-xs text-slate-400">
              {sheetPhase === 1
                ? "Analicemos tu cuerpo y descanso."
                : "Ahora miremos hacia adentro."}
            </SheetDescription>
          </SheetHeader>

          {/* CONTENT AREA CON ANIMACIÓN */}
          <div className="p-6 flex-1 bg-slate-950 overflow-y-auto">
            {/* FASE 1: ENERGÍA (Sueño + Batería Social) */}
            {sheetPhase === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* 1. SUEÑO */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-white/50 flex items-center gap-2">
                      <Moon className="w-3 h-3" /> Horas de Sueño
                    </label>
                    <span className="text-sm font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {entry.sleep}h
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 relative">
                    <div className="absolute top-1/2 left-3 -translate-y-1/2 text-white/20">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 text-white/20">
                      <Sun className="w-4 h-4" />
                    </div>
                    <Slider
                      defaultValue={[entry.sleep]}
                      max={SLEEP_HOURS.MAX}
                      min={SLEEP_HOURS.MIN}
                      step={SLEEP_HOURS.STEP}
                      onValueChange={(vals) =>
                        setEntry((p) => ({ ...p, sleep: vals[0] }))
                      }
                      className="w-full px-6"
                    />
                  </div>
                </div>

                {/* 2. BATERÍA SOCIAL */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-white/50 flex items-center gap-2">
                      <Battery className="w-3 h-3" /> Batería Social
                    </label>
                    <span
                      className={cn(
                        "text-[10px] uppercase font-bold px-2 py-0.5 rounded border",
                        entry.socialBattery < 0
                          ? "text-red-400 bg-red-500/10 border-red-500/20"
                          : entry.socialBattery > 0
                            ? "text-green-400 bg-green-500/10 border-green-500/20"
                            : "text-white/50 bg-white/5 border-white/10",
                      )}
                    >
                      {entry.socialBattery === 0
                        ? "Neutral"
                        : entry.socialBattery > 0
                          ? "Alta"
                          : "Baja"}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <Slider
                      defaultValue={[entry.socialBattery]}
                      max={SOCIAL_BATTERY.MAX}
                      min={SOCIAL_BATTERY.MIN}
                      step={1}
                      onValueChange={(vals) =>
                        setEntry((p) => ({ ...p, socialBattery: vals[0] }))
                      }
                    />
                    <div className="flex justify-between text-[10px] text-white/30 mt-3 font-medium uppercase tracking-wide">
                      <span>{SOCIAL_BATTERY.LABELS.LOW}</span>
                      <span>{SOCIAL_BATTERY.LABELS.HIGH}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FASE 2: MENTE (Mood + Focus) */}
            {sheetPhase === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* 3. MOOD */}
                {/* 3. MOOD */}
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-wider font-semibold text-white/50 ml-1 block">
                    Estado de Ánimo General
                  </label>

                  {/* FIX MOBILE: overflow-x-auto permite deslizar si no cabe */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {/* min-w-max evita que los iconos se aplasten, flex y mx-auto los centra */}
                    <div className="min-w-max flex justify-center mx-auto">
                      <MoodSelector
                        value={entry.mood}
                        onChange={(val) =>
                          setEntry((p) => ({ ...p, mood: val }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* 4. FOCUS / CLARIDAD */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-white/50 flex items-center gap-2">
                      <Brain className="w-3 h-3" /> Claridad Mental
                    </label>
                    <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {getFocusLabel(entry.focus)}
                    </span>
                  </div>
                  {/* Focus Selector Custom */}
                  <div className="flex gap-2 h-12">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          setEntry((p) => ({ ...p, focus: level }))
                        }
                        className={cn(
                          "flex-1 rounded-lg border text-sm font-bold transition-all duration-200",
                          entry.focus === level
                            ? "bg-purple-600 text-white border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                            : "bg-white/5 text-white/30 border-white/5 hover:bg-white/10",
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-white/30 px-1">
                    <span>Nublado</span>
                    <span>Nítido</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER NAVEGACIÓN */}
          <div className="p-6 border-t border-white/10 bg-white/5 flex gap-3">
            {sheetPhase === 2 && (
              <Button
                variant="outline"
                onClick={() => setSheetPhase(1)}
                className="h-12 w-16 rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}

            <Button
              onClick={() =>
                sheetPhase === 1 ? setSheetPhase(2) : submitEntry()
              }
              className={cn(
                "flex-1 h-12 rounded-xl text-white font-medium shadow-lg transition-all border",
                sheetPhase === 1
                  ? "bg-white/10 hover:bg-white/20 border-white/10"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20 border-indigo-500/50",
              )}
            >
              {sheetPhase === 1 ? "Siguiente" : "Guardar Registro"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {step === "feedback" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500">
          <article className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
            <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              ¡Entrada Guardada!
            </h2>
            <p className="text-sm text-slate-400 mb-8">
              Tus datos han sido encriptados y almacenados.
            </p>
            <Button
              asChild
              className="w-full h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10"
            >
              <Link href="/">Volver al Dashboard</Link>
            </Button>
          </article>
        </div>
      )}
    </Layout>
  );
}
