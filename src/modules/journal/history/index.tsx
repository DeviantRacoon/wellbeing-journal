import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertTriangle,
  ArrowLeft,
  Brain,
  Calendar,
  CheckCircle2,
  Loader2,
  Moon,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  useToast,
} from "@/commons/components";

import { BottomNav } from "@/commons/components/layout/bottom-nav";
import { cn } from "@/commons/libs/cn";
import { FOCUS_LEVELS, MOOD_MAX } from "@/commons/libs/constants";
import { api } from "@/commons/libs/request";
import { DiagnosisResponse } from "@/types/diagnosis";
import Layout from "../components/layout";
import useJournalHistory from "./useJournalHistory";

export default function JournalHistory() {
  const {
    entries,
    selectedEntry,
    setSelectedEntry,
    fetchEntries,
    isLoading,
    hasMore,
  } = useJournalHistory();
  const { toast } = useToast();
  const [isGeneratingDiagnosis, setIsGeneratingDiagnosis] = useState(false);
  /* --- STATE: Diagnosis Sheet --- */
  const [diagnosisContent, setDiagnosisContent] =
    useState<DiagnosisResponse | null>(null);
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);

  /* --- STATE: Detail Sheet --- */
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleGenerateDiagnosis = async () => {
    setIsGeneratingDiagnosis(true);
    try {
      const response = await api.post("analyze-wellbeing", {});
      if (response.ok && response.data) {
        setDiagnosisContent(response.data as DiagnosisResponse);
        setIsDiagnosisOpen(true);
      } else {
        throw new Error(response.message || "Error desconocido");
      }
    } catch (error: any) {
      toast.error(
        "Error",
        error.message || "No se pudo generar el diagnóstico.",
      );
    } finally {
      setIsGeneratingDiagnosis(false);
    }
  };

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          fetchEntries({ reset: false });
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchEntries, isLoading, hasMore]);

  const handleEntryClick = (entry: any) => {
    setSelectedEntry(entry);
    setIsDetailOpen(true);
  };

  return (
    <Layout>
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-xl h-10 w-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
          >
            <Link href="/journal">
              <ArrowLeft className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Historial
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/20 hover:border-indigo-500/30 gap-2"
          onClick={handleGenerateDiagnosis}
          disabled={isGeneratingDiagnosis}
        >
          {isGeneratingDiagnosis ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isGeneratingDiagnosis ? "Generando..." : "Diagnóstico Semanal"}
          </span>
        </Button>
      </header>

      {isLoading && entries.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-white/40 z-10">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="text-sm font-medium">Cargando historial...</p>
        </div>
      )}

      <main
        className={cn(
          "flex-1 px-4 pb-20 z-10 max-w-xl mx-auto w-full space-y-4 scrollbar-hide overflow-y-auto overscroll-none",
          entries.length === 0 && isLoading ? "hidden" : "",
          // Block interaction (scrolling) while loading new data
          isLoading && entries.length > 0 ? "pointer-events-none" : "",
        )}
      >
        {entries.map((entry, index) => {
          const entryDate = parseISO(entry.createdAt!);

          return (
            <article
              key={entry.id}
              onClick={() => handleEntryClick(entry)}
              style={
                { animationDelay: `${index * 100}ms` } as React.CSSProperties
              }
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-white/10 cursor-pointer active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
            >
              {/* DATE HEADER */}
              <div className="flex items-center justify-between mb-3 text-xs text-white/40 uppercase tracking-widest font-bold">
                <span className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {format(entryDate, "EEE d MMM", { locale: es })}
                </span>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  {format(entryDate, "HH:mm")}
                </span>
              </div>

              {/* CONTENT PREVIEW */}
              <p className="text-sm text-white/80 leading-relaxed line-clamp-3 mb-4 font-light">
                "{entry.content}"
              </p>

              {/* METRICS ROW */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border",
                    entry.mood >= 4
                      ? "bg-green-500/10 border-green-500/20 text-green-300"
                      : entry.mood <= 2
                        ? "bg-red-500/10 border-red-500/20 text-red-300"
                        : "bg-yellow-500/10 border-yellow-500/20 text-yellow-300",
                  )}
                >
                  <span>Mood:</span>
                  <span className="font-bold">
                    {entry.mood}/{MOOD_MAX}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/5 text-slate-400">
                  <Moon className="w-3 h-3" />
                  <span>{entry.sleep}h</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/5 text-slate-400">
                  <Zap className="w-3 h-3" />
                  <span>
                    {entry.socialBattery > 0 ? "+" : ""}
                    {entry.socialBattery}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/5 text-slate-400">
                  <Brain className="w-3 h-3" />
                  <span>
                    {entry.focus}/{FOCUS_LEVELS.MAX}
                  </span>
                </div>
              </div>
            </article>
          );
        })}

        {/* --- CENTINELA Y LOADER --- */}
        {hasMore && (
          <div
            ref={observerTarget}
            className="w-full py-8 flex justify-center items-center"
          >
            {isLoading && (
              <div className="flex flex-col items-center gap-2 text-white/40">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Cargando más...
                </span>
              </div>
            )}
          </div>
        )}
      </main>

      <Sheet open={isDiagnosisOpen} onOpenChange={setIsDiagnosisOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl border-t border-white/10 bg-slate-950 shadow-2xl p-0 max-h-[90vh] flex flex-col"
        >
          {diagnosisContent && (
            <div className="flex flex-col h-full overflow-hidden">
              <SheetHeader className="px-6 pt-6 pb-4 text-left border-b border-white/5 bg-white/5 shrink-0">
                <div className="mx-auto w-12 h-1 bg-white/10 rounded-full mb-4" />
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      Diagnóstico Semanal IA
                    </SheetTitle>
                    <SheetDescription className="text-slate-400">
                      Análisis basado en tus últimas entradas
                    </SheetDescription>
                  </div>
                  {diagnosisContent.alerta_roja && (
                    <span className="bg-red-500/20 text-red-300 text-xs font-bold px-3 py-1 rounded-full border border-red-500/20 animate-pulse flex items-center gap-1.5 whitespace-nowrap">
                      <AlertTriangle className="w-3 h-3" />
                      ALERTA
                    </span>
                  )}
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Resumen */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">
                    Resumen Clínico
                  </h3>
                  <p className="text-white/90 leading-relaxed font-light text-sm">
                    {diagnosisContent.resumen_clinico}
                  </p>
                </div>

                {/* Indicadores */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center space-y-2">
                    <div className="text-xs text-white/50 font-medium">
                      Estabilidad
                    </div>
                    <div
                      className={cn(
                        "text-2xl font-bold",
                        diagnosisContent.indicadores.estabilidad_emocional >= 7
                          ? "text-green-400"
                          : diagnosisContent.indicadores
                                .estabilidad_emocional >= 4
                            ? "text-yellow-400"
                            : "text-red-400",
                      )}
                    >
                      {diagnosisContent.indicadores.estabilidad_emocional}/10
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center space-y-2">
                    <div className="text-xs text-white/50 font-medium">
                      Energía
                    </div>
                    <div
                      className={cn(
                        "text-2xl font-bold",
                        diagnosisContent.indicadores.nivel_energia >= 7
                          ? "text-green-400"
                          : diagnosisContent.indicadores.nivel_energia >= 4
                            ? "text-yellow-400"
                            : "text-red-400",
                      )}
                    >
                      {diagnosisContent.indicadores.nivel_energia}/10
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center space-y-2">
                    <div className="text-xs text-white/50 font-medium">
                      Riesgo Burnout
                    </div>
                    <div
                      className={cn(
                        "text-2xl font-bold",
                        diagnosisContent.indicadores.riesgo_burnout <= 3
                          ? "text-green-400"
                          : diagnosisContent.indicadores.riesgo_burnout <= 6
                            ? "text-yellow-400"
                            : "text-red-400",
                      )}
                    >
                      {diagnosisContent.indicadores.riesgo_burnout}/10
                    </div>
                  </div>
                </div>

                {/* Hallazgos */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest px-1">
                    Hallazgos Clave
                  </h3>
                  <div className="space-y-2">
                    {diagnosisContent.hallazgos_clave.map((hallazgo, i) => (
                      <div
                        key={i}
                        className="flex gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/5"
                      >
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                        <p className="text-sm text-slate-300 leading-snug">
                          {hallazgo}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recomendación */}
                <div className="bg-indigo-500/10 rounded-2xl p-5 border border-indigo-500/20">
                  <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Recomendación Terapéutica
                  </h3>
                  <p className="text-indigo-100/90 leading-relaxed font-light text-sm">
                    {diagnosisContent.recomendacion_terapeutica}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl border-t border-white/10 bg-slate-950 shadow-2xl p-0 max-h-[90vh] flex flex-col"
        >
          {selectedEntry && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 text-left border-b border-white/5 bg-white/5">
                <div className="mx-auto w-12 h-1 bg-white/10 rounded-full mb-4" />
                <div className="flex justify-between items-start">
                  <SheetTitle className="text-xl font-bold text-white capitalize">
                    Entrada del{" "}
                    {format(parseISO(selectedEntry.createdAt!), "EEEE", {
                      locale: es,
                    })}
                  </SheetTitle>
                  <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                    {format(parseISO(selectedEntry.createdAt!), "d MMM", {
                      locale: es,
                    })}
                  </span>
                </div>
                <SheetDescription className="text-xs text-slate-400">
                  {format(parseISO(selectedEntry.createdAt!), "HH:mm")}
                </SheetDescription>
              </SheetHeader>

              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 sm:space-y-8 flex-1">
                <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-base sm:text-lg text-white/90 leading-relaxed font-light whitespace-pre-wrap">
                    "{selectedEntry.content}"
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Mood */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase font-bold tracking-wider">
                      <Zap className="w-3 h-3" /> Mood
                    </div>
                    <span className="text-2xl font-light text-white">
                      {selectedEntry.mood}/{MOOD_MAX}
                    </span>
                  </div>

                  {/* Sleep */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase font-bold tracking-wider">
                      <Moon className="w-3 h-3" /> Sleep
                    </div>
                    <span className="text-2xl font-light text-white">
                      {selectedEntry.sleep}h
                    </span>
                  </div>

                  {/* Social */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase font-bold tracking-wider">
                      <Zap className="w-3 h-3" /> Social
                    </div>
                    <span className="text-2xl font-light text-white">
                      {selectedEntry.socialBattery}
                    </span>
                  </div>

                  {/* Focus */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase font-bold tracking-wider">
                      <Brain className="w-3 h-3" /> Focus
                    </div>
                    <span className="text-2xl font-light text-white">
                      {selectedEntry.focus}/{FOCUS_LEVELS.MAX}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <BottomNav />
    </Layout>
  );
}
