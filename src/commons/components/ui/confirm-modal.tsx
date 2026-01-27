"use client";

import { Button } from "@/commons/components/ui/button";
import { cn } from "@/commons/libs/cn";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "info" | "success";
  isLoading?: boolean;
}

const ConfirmModal = React.memo<ConfirmModalProps>(
  ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger",
    isLoading = false,
  }) => {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (isOpen) {
        setIsVisible(true);
        document.body.style.overflow = "hidden";
      } else {
        const timer = setTimeout(() => setIsVisible(false), 200); // Tiempos ajustados a la animación CSS
        document.body.style.overflow = "unset";
        return () => clearTimeout(timer);
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }, [isOpen]);

    if (!mounted) return null;
    if (!isOpen && !isVisible) return null;

    // Configuración de Estilos por Variante
    const getVariantStyles = () => {
      switch (variant) {
        case "danger":
          return {
            icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
            glow: "bg-red-500",
            border: "border-red-500/20",
            bgIcon: "bg-red-500/10",
            btnVariant: "destructive" as const,
          };
        case "success":
          return {
            icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
            glow: "bg-emerald-500",
            border: "border-emerald-500/20",
            bgIcon: "bg-emerald-500/10",
            btnVariant: "success" as const,
          };
        default: // info
          return {
            icon: <Info className="w-6 h-6 text-indigo-400" />,
            glow: "bg-indigo-500",
            border: "border-indigo-500/20",
            bgIcon: "bg-indigo-500/10",
            btnVariant: "primary" as const,
          };
      }
    };

    const styles = getVariantStyles();

    const content = (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop con Blur */}
        <div
          className={cn(
            "fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-out",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={isLoading ? undefined : onClose}
          aria-hidden="true"
        />

        {/* Modal Container */}
        <div
          className={cn(
            "relative w-full max-w-md transform overflow-hidden rounded-2xl border bg-slate-950 p-6 shadow-2xl shadow-black/40 transition-all duration-300 ease-out sm:w-full",
            // Border sutil blanco por defecto, sobreescrito por la variante si es necesario
            "border-white/10",
            isOpen
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4"
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close X Button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute right-4 top-4 rounded-lg p-1 text-slate-500 opacity-70 transition-all hover:bg-white/10 hover:text-white hover:opacity-100 focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </button>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              {/* Icono con Efecto Glow */}
              <div className="mx-auto sm:mx-0 shrink-0 relative group">
                {/* El "Brillo" detrás del icono */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500",
                    styles.glow
                  )}
                />

                {/* Contenedor del Icono */}
                <div
                  className={cn(
                    "relative flex h-12 w-12 items-center justify-center rounded-full border bg-opacity-50 backdrop-blur-md",
                    styles.border,
                    styles.bgIcon
                  )}
                >
                  {styles.icon}
                </div>
              </div>

              {/* Contenido de Texto */}
              <div className="text-center sm:text-left w-full">
                <h3
                  className="text-lg font-semibold leading-6 text-white tracking-tight"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <div className="text-sm text-slate-400 leading-relaxed">
                    {description}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer de Botones */}
            <div className="mt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto border-white/10 bg-transparent hover:bg-white/5 text-slate-300"
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                variant={styles.btnVariant}
                onClick={onConfirm}
                loading={isLoading ? "loading" : "idle"}
                className="w-full sm:w-auto shadow-lg"
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

    return createPortal(content, document.body);
  }
);

ConfirmModal.displayName = "ConfirmModal";

export { ConfirmModal };
