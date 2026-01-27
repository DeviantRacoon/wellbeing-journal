"use client";

import { Toast, useToast } from "@/commons/hooks/use-toast";
import { cn } from "@/commons/libs/cn";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom"; // Importante para el Portal

// Estilos estáticos fuera del componente para no recrearlos en cada render
const TOAST_STYLES = {
  success: {
    icon: CheckCircle2,
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "bg-emerald-500",
  },
  error: {
    icon: AlertCircle,
    border: "border-red-500/20",
    bg: "bg-red-500/10",
    text: "text-red-400",
    glow: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-500/20",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    glow: "bg-amber-500",
  },
  info: {
    icon: Info,
    border: "border-indigo-500/20",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    glow: "bg-indigo-500",
  },
} as const;

const ToastItem = React.memo(
  ({
    id,
    type,
    title,
    description,
    duration,
    onRemove,
  }: Toast & { onRemove: (id: string) => void }) => {
    // Estado para controlar la animación
    const [isExiting, setIsExiting] = useState(false);

    // Obtenemos estilos
    const style = TOAST_STYLES[type];
    const Icon = style.icon;

    const handleDismiss = useCallback(() => {
      setIsExiting(true); // 1. Activa la animación de salida

      // 2. Espera a que termine la animación (500ms) antes de eliminar del DOM
      setTimeout(() => {
        onRemove(id);
      }, 500);
    }, [id, onRemove]);

    // Auto-dismiss
    useEffect(() => {
      if (duration && duration > 0) {
        const timer = setTimeout(handleDismiss, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, handleDismiss]);

    return (
      <div
        className={cn(
          // Base Layout & Glassmorphism
          "group relative flex w-full pointer-events-auto overflow-hidden rounded-xl border p-4 shadow-xl select-none bg-slate-950/90 backdrop-blur-md",
          style.border, // Color del borde según tipo

          // --- ANIMATION CONFIG ---
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]", // Curva de animación suave (Apple style)

          // --- ESTADOS DE ENTRADA / SALIDA ---
          isExiting
            ? cn(
                "opacity-0 scale-95", // Efecto común: Se hace transparente y un poco más pequeño
                // SALIDA MÓVIL: Se va hacia arriba (negativo Y)
                "-translate-y-full mb-[-100%]",
                // SALIDA DESKTOP: Se va hacia la derecha (positivo X) y resetea la Y
                "sm:translate-x-full sm:translate-y-0"
              )
            : cn(
                "opacity-100 scale-100 translate-x-0 translate-y-0", // Estado Normal
                // ENTRADA ANIMADA (Tailwind Animate)
                "animate-in slide-in-from-top-full sm:slide-in-from-top-0 sm:slide-in-from-right-full fade-in zoom-in-95"
              )
        )}
        role="alert"
        // Al salir, quitamos eventos del mouse para que no se pueda clickear mientras desaparece
        style={{ pointerEvents: isExiting ? "none" : "auto" }}
      >
        {/* Glow Line */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 opacity-50",
            style.glow
          )}
        />

        <div className="flex gap-3 w-full">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-opacity-50",
              style.border,
              style.bg
            )}
          >
            <Icon className={cn("h-5 w-5", style.text)} />
          </div>

          <div className="flex-1 flex flex-col justify-center min-w-0">
            <h3 className="text-sm font-semibold text-white leading-tight truncate pr-6">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 rounded-md p-1 text-slate-500 opacity-0 transition-opacity hover:text-white focus:opacity-100 focus:outline-none group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  },
  (prev, next) => prev.id === next.id
);

ToastItem.displayName = "ToastItem";

export function Toaster() {
  const { toasts, removeToast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitamos renderizar en el servidor (Hydration mismatch)
  if (!mounted) return null;

  // Usamos Portal para inyectarlo en el body y evitar problemas de z-index o overflow hidden en contenedores padres
  return createPortal(
    <div
      className={cn(
        "fixed z-[9999] flex flex-col gap-2 w-full p-4 transition-all duration-300 pointer-events-none",
        // Mobile: Top Center
        "top-0 left-1/2 -translate-x-1/2 items-center max-w-[calc(100vw-2rem)]",
        // Desktop: Top Right
        "sm:top-4 sm:right-4 sm:left-auto sm:translate-x-0 sm:items-end sm:max-w-[400px]"
      )}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
}
