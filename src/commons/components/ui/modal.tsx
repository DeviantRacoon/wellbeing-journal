"use client";

import { cn } from "@/commons/libs/cn";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// --- TYPES ---
type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  className?: string;
  preventCloseOnOutsideClick?: boolean;
}

// --- CONFIG ---
const ANIMATION_DURATION = 300;

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
};

// --- COMPONENT ---
const ModalComponent = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  preventCloseOnOutsideClick = false,
}: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // 1. HYDRATION CHECK
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. ANIMATION LIFECYCLE MANAGER
  // Controla la entrada y salida suave antes de desmontar el componente del DOM
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      timeoutId = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "";
      }, ANIMATION_DURATION);
    }

    return () => {
      clearTimeout(timeoutId);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (preventCloseOnOutsideClick) return;
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose, preventCloseOnOutsideClick]
  );

  if (!isMounted || !shouldRender) return null;

  const content = (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
    >
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity ease-out duration-300",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* MODAL CONTAINER */}
      <div
        ref={modalRef}
        className={cn(
          "relative w-full flex flex-col overflow-hidden bg-slate-950 border border-white/10 rounded-xl shadow-2xl shadow-black/50",
          sizeClasses[size],
          "transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-8",
          className
        )}
      >
        {/* HEADER */}
        {(title || description) && (
          <div className="flex flex-col gap-1 px-6 py-5 border-b border-white/5 bg-white/2">
            {title && (
              <h2 className="text-lg font-semibold text-white tracking-tight leading-none">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-slate-400">{description}</p>
            )}
          </div>
        )}

        {/* CLOSE BUTTON (Absolute) */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 z-10"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* BODY (Scrollable area) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 text-slate-300 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {children}
        </div>

        {/* FOOTER */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5 bg-white/2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export const Modal = React.memo(ModalComponent);
