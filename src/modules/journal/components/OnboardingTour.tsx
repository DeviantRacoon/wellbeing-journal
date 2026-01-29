import { Button } from "@/commons/components";
import { cn } from "@/commons/libs/cn";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

const TOUR_STEPS = [
  {
    targetId: null,
    title: "Bienvenido a PaM",
    content:
      "Tu compañero de bienestar emocional. Hagamos un recorrido rápido.",
  },
  {
    targetId: "hero-new-entry",
    title: "Registra tu Día",
    content: "Aquí puedes escribir cómo te sientes. Solo toma unos minutos.",
    position: "bottom",
  },
  {
    targetId: "diagnosis-progress",
    title: "Tu Progreso",
    content:
      "Completa 5 entradas a la semana para recibir un análisis IA personalizado.",
    position: "bottom",
  },
  {
    targetId: "nav-history",
    title: "Historial",
    content: "Consulta tus entradas pasadas y tus diagnósticos semanales aquí.",
    position: "top",
  },
];

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(-1); // -1: Loading check
  const [isVisible, setIsVisible] = useState(false);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenTour_v1");
    if (!hasSeen) {
      // Small delay to let UI render
      setTimeout(() => {
        setCurrentStep(0);
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (currentStep >= 0 && currentStep < TOUR_STEPS.length) {
      const step = TOUR_STEPS[currentStep];
      if (step.targetId) {
        const el = document.getElementById(step.targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          setHighlightRect(rect);
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        setHighlightRect(null);
      }
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenTour_v1", "true");
  };

  if (!isVisible || currentStep === -1) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
        {/* Backdrop with "hole" using localized layering or SVG mask is complex.
            Simpler approach: Dim background, highlight element uses z-index or a cloned overlay?
            Actually, commonly used "spotlight" effect: huge border width or SVG path.

            Let's use a simpler solid backdrop with high z-index and render the card on top.
            We won't actually "expose" the element underneath for interaction to keep it simple and robust.
         */}

        {/* Dark Bg */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Highlight Zone (Visual only) */}
        {highlightRect && (
          <motion.div
            layoutId="highlight"
            className="absolute border-2 border-indigo-400 rounded-2xl bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
            style={{
              top: highlightRect.top - 4,
              left: highlightRect.left - 4,
              width: highlightRect.width + 8,
              height: highlightRect.height + 8,
              boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.85)",
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          />
        )}

        {/* Tooltip Card */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "pointer-events-auto bg-slate-900 border border-indigo-500/30 p-6 rounded-3xl shadow-2xl max-w-sm w-full mx-auto flex flex-col gap-4 relative",
              highlightRect ? "absolute" : "relative", // If highlight, position explicitly?
              // Actually, centering the modal for Step 0 is fine.
              // For others, let's try to position it relative to the highlight if possible.
              // To keep it robust/responsive, let's stick to "Bottom Sheet" style or "Centered" style for simplicity
              // unless user specifically requested "floating near element".
              // The "Simple Tour" usually works best centered or bottom-fixed on mobile.
            )}
            style={
              highlightRect
                ? {
                    // Primitive positioning logic
                    top:
                      step.position === "bottom"
                        ? Math.min(
                            window.innerHeight - 200,
                            highlightRect.bottom + 20,
                          )
                        : undefined,
                    bottom:
                      step.position === "top"
                        ? window.innerHeight - highlightRect.top + 20
                        : undefined,
                    // Centered horizontally if possible, or clamp to screen
                    left: "50%",
                    transform: "translateX(-50%)",
                    position: "fixed",
                  }
                : {}
            }
          >
            {step.targetId === null && (
              <div className="mx-auto p-3 rounded-full bg-indigo-500/20 text-indigo-400 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-white mb-2 text-center sm:text-left">
                {step.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-center sm:text-left">
                {step.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5">
              <button
                onClick={handleComplete}
                className="text-xs font-medium text-slate-500 hover:text-white transition-colors"
              >
                Omitir
              </button>
              <div className="flex gap-2">
                {/* Dots indicator */}
                <div className="flex gap-1.5 items-center mr-4">
                  {TOUR_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        i === currentStep ? "bg-indigo-400" : "bg-white/10",
                      )}
                    />
                  ))}
                </div>
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
                >
                  {currentStep === TOUR_STEPS.length - 1
                    ? "¡Listo!"
                    : "Siguiente"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
