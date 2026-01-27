"use client";

import { cn } from "@/commons/libs/cn";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      required,
      maxLength,
      minLength,
      value,
      onChange,
      error,
      leftIcon,
      ...props
    },
    ref,
  ) => {
    // Estado para visibilidad de contraseña
    const [showPassword, setShowPassword] = useState(false);

    // Estado local para contar caracteres si no se pasa 'value' controlado externamente
    const [localLength, setLocalLength] = useState(
      typeof value === "string" ? value.length : 0,
    );

    // Lógica para alternar el tipo de input
    const inputType = type === "password" && showPassword ? "text" : type;

    // Manejador interno para actualizar el contador
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalLength(e.target.value.length);
      if (onChange) onChange(e);
    };

    // Clases CSS para ocultar flechas en input type="number"
    const numberStyles =
      type === "number"
        ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        : "";

    return (
      <div className="w-full space-y-2">
        {/* Label con indicador de Requerido */}
        {label && (
          <label className="text-xs uppercase tracking-wider font-semibold text-white/50 ml-1 mb-1 block">
            {label}
          </label>
        )}

        <div className="relative group">
          {/* Icono Izquierdo */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-brand-primary transition-colors duration-300">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            required={required}
            maxLength={maxLength}
            minLength={minLength}
            onChange={handleChange}
            value={value}
            className={cn(
              // Premium "Glass" Aesthetic
              "flex h-12 w-full rounded-md border border-white/10 bg-white/5 py-2 text-base text-white shadow-sm transition-all duration-300",
              "placeholder:text-white/40",
              "hover:border-white/20 hover:bg-white/10",
              "focus-visible:outline-none focus-visible:border-brand-primary/50 focus-visible:ring-brand-primary/10 focus-visible:ring-offset-3 focus-visible:ring-offset-white/10",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon ? "pl-10" : "px-3",
              // Error state
              error &&
                "border-destructive/50 bg-destructive/5 focus-visible:ring-destructive/20 focus-visible:border-destructive text-destructive placeholder:text-destructive/50",
              type === "password" && "pr-10",
              numberStyles,
              className,
            )}
            {...props}
          />

          {/* Toggle de Contraseña */}
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-200"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Footer: Errores y Contadores */}
        <div className="flex justify-between items-start text-xs min-h-5">
          {/* Mensaje de Error o Ayuda */}
          <div className="flex-1">
            {error && error !== " " ? (
              <span className="text-destructive font-medium animate-in slide-in-from-top-1 fade-in duration-200 flex items-center gap-1">
                {error}
              </span>
            ) : (
              // Opcional: Mostrar minLength si no hay error
              minLength &&
              localLength < minLength &&
              localLength > 0 && (
                <span className="text-white/60">
                  Mínimo {minLength} caracteres
                </span>
              )
            )}
          </div>

          {/* Contador de caracteres (Solo si existe maxLength) */}
          {maxLength && (
            <span
              className={cn(
                "ml-2 text-white/40",
                localLength >= maxLength ? "text-destructive font-bold" : "",
              )}
            >
              {localLength} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
