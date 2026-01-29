import { api } from "@/commons/libs/request";
import { CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DiagnosisStatus {
  count: number;
  hasDiagnosisThisWeek: boolean;
  canDiagnose: boolean;
  remaining: number;
}

export function DiagnosisProgress() {
  const [status, setStatus] = useState<DiagnosisStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await api.get<DiagnosisStatus>("analyze-wellbeing");
      if (res.ok && res.data) {
        setStatus(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Listen for updates from new entries
    const handleUpdate = () => fetchStatus();
    window.addEventListener("journal-update", handleUpdate);
    return () => window.removeEventListener("journal-update", handleUpdate);
  }, []);

  if (loading || !status) return null;

  // Don't show if already diagnosed this week? Or show "Completed"?
  // Let's show "Completed" state if diagnosis exists.

  const progress = Math.min(100, (status.count / 5) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Salud Mental
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {status.hasDiagnosisThisWeek
            ? "Completado"
            : `${status.count}/5 Entradas`}
        </span>
      </div>

      {!status.hasDiagnosisThisWeek ? (
        <div className="space-y-3">
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {status.canDiagnose ? (
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/80">
                ¡Estás listo para tu diagnóstico semanal!
              </p>
              <Link
                href="/journal/history"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
              >
                Ver ahora &rarr;
              </Link>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Escribe{" "}
              <strong className="text-indigo-400">
                {status.remaining} entradas más
              </strong>{" "}
              esta semana para desbloquear tu análisis IA.
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 py-1">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <p className="text-xs text-slate-300 leading-snug">
            Has completado tu diagnóstico de esta semana.
            <Link
              href="/journal/history"
              className="ml-1 text-green-400 font-bold hover:underline"
            >
              Ver resultado
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
