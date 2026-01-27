"use client";

import { cn } from "@/commons/libs/cn";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  // Base styles:
  // - cursor-pointer añadido
  // - transition-colors en lugar de all (para evitar movimientos bruscos de layout)
  // - focus ring sutil
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 cursor-pointer active:scale-[0.99]",
  {
    variants: {
      variant: {
        // DEFAULT: Estilo Glass (Igual que tu Input)
        // Sin saltos, solo cambio sutil de opacidad en fondo y borde
        default:
          "border border-white/10 bg-white/5 text-white shadow-sm hover:bg-white/10 hover:border-white/20",

        // PRIMARY: Para el botón de Login (Gradiente)
        // Eliminé la sombra resplandeciente exagerada
        primary:
          "bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-0 hover:from-indigo-500 hover:to-violet-500 shadow-md",

        // DESTRUCTIVE: Rojo translúcido (No sólido)
        destructive:
          "border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/30",

        // OUTLINE: Solo borde
        outline:
          "border border-white/10 bg-transparent text-white hover:bg-white/5 hover:text-white",

        // SECONDARY: Gris plano
        secondary: "bg-slate-800 text-white hover:bg-slate-700",

        // GHOST: Sin bordes
        ghost: "hover:bg-white/5 text-slate-300 hover:text-white",

        // LINK: Solo texto
        link: "text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300",

        // SUCCESS: Verde translúcido
        success:
          "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
      },
      size: {
        default: "h-12 px-6 py-3", // Standard Mobile Size (48px)
        sm: "h-9 rounded-md px-3 text-sm [&_svg]:size-4", // Small kept for desktop dense UIs
        lg: "h-14 rounded-md px-8 text-lg",
        icon: "h-12 w-12",
        "icon-sm": "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonLoadingState = "idle" | "loading" | "success" | "error";

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: ButtonLoadingState;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loadingText?: string;
  successText?: string;
  errorText?: string;
}

// Iconos internos simples para no depender de librerías externas en este archivo
const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const SuccessIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-in zoom-in duration-300", className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ErrorIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-in zoom-in duration-300", className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = "idle",
      leftIcon,
      rightIcon,
      loadingText,
      successText,
      errorText,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading === "loading";

    const getContent = () => {
      switch (loading) {
        case "loading":
          return (
            <>
              <LoadingSpinner className="w-4 h-4" />
              {loadingText || children}
            </>
          );
        case "success":
          return (
            <>
              <SuccessIcon className="w-4 h-4" />
              {successText || children}
            </>
          );
        case "error":
          return (
            <>
              <ErrorIcon className="w-4 h-4" />
              {errorText || children}
            </>
          );
        default:
          return (
            <>
              {leftIcon && <span className="inline-flex">{leftIcon}</span>}
              {children}
              {rightIcon && <span className="inline-flex">{rightIcon}</span>}
            </>
          );
      }
    };

    const getVariant = () => {
      if (loading === "success") return "success";
      if (loading === "error") return "destructive";
      return variant;
    };

    return (
      <Comp
        className={cn(
          buttonVariants({ variant: getVariant(), size, className }),
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {asChild ? children : getContent()}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
