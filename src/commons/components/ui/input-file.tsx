"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileText,
  UploadCloud,
  XCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../libs/cn";

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export interface InputFileProps {
  label?: string;
  name: string;
  value?: File | null; // El archivo seleccionado actualmente
  onChange: (file: File | null) => void; // Retorna el archivo al padre
  accept?: string; // Ej: "image/png, image/jpeg, .pdf"
  maxSizeInMB?: number; // Ej: 5 (MB)
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

const InputFileComponent = ({
  label,
  name,
  value,
  onChange,
  accept = "*",
  maxSizeInMB = 5,
  error: externalError,
  disabled = false,
  className,
  required,
}: InputFileProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasFile = !!value;
  const isImage = value?.type.startsWith("image/");
  const effectiveError = externalError || internalError;

  // 1. MANEJO DE PREVISUALIZACIÓN (Alto Rendimiento)
  useEffect(() => {
    if (!value || !isImage) {
      setPreviewUrl(null);
      return;
    }

    // Usamos createObjectURL que es mucho más rápido y ligero que FileReader (base64)
    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);

    // CRÍTICO: Limpieza de memoria para evitar leaks cuando cambia el archivo o se desmonta
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [value, isImage]);

  // 2. VALIDACIÓN Y SELECCIÓN
  const validateAndSetFile = useCallback(
    (file: File | null) => {
      setInternalError(null);

      if (!file) {
        onChange(null);
        return;
      }

      // Validar Tamaño
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        setInternalError(`El archivo excede el máximo de ${maxSizeInMB}MB.`);
        // Opcional: ¿Quieres que el padre reciba null si falla la validación?
        // onChange(null);
        return;
      }

      // Validar Tipo (Básico, el input accept hace la mayoría del trabajo)
      // Si el navegador no soporta 'accept' correctamente, esto es un fallback.
      if (
        accept !== "*" &&
        accept
          .split(",")
          .every((type) => !file.type.match(type.trim().replace("*", ".*")))
      ) {
        // Nota: Esta validación de tipo en JS es compleja de hacer perfecta vs el atributo HTML.
        // A menudo es mejor confiar en el atributo 'accept' del input y validar en backend.
      }

      onChange(file);
    },
    [maxSizeInMB, accept, onChange]
  );

  // --- HANDLERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    validateAndSetFile(file);
  };

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;

      const file = e.dataTransfer.files?.[0] || null;
      // Validar que corresponda al accept si es un drop
      if (file && inputRef.current) {
        // Hack para asignar el archivo droppeado al input invisible
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputRef.current.files = dataTransfer.files;
      }
      validateAndSetFile(file);
    },
    [disabled, validateAndSetFile]
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar abrir el selector al cerrar
    e.preventDefault();
    onChange(null);
    setInternalError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // --- RENDER UI ---

  // Clases dinámicas del contenedor
  const containerClasses = cn(
    // Base
    "relative flex items-center justify-between w-full rounded-xl border px-4 transition-all duration-200 group outline-none",
    // Compact Height (se ajusta si hay imagen)
    hasFile && isImage ? "h-auto py-3" : "h-16",
    // Glass Style
    "bg-white/5 backdrop-blur-md",
    // States
    isDragging
      ? "border-indigo-500 bg-indigo-500/10"
      : effectiveError
      ? "border-red-500/50 bg-red-500/5"
      : "border-white/10 hover:border-white/20 hover:bg-white/10",
    // Disabled
    disabled
      ? "cursor-not-allowed opacity-50"
      : "cursor-pointer focus-within:ring-1 focus-within:ring-indigo-500/50",
    className
  );

  return (
    <div className="w-full space-y-2">
      {/* LABEL */}
      {label && (
        <label
          className={cn(
            "text-xs uppercase tracking-wider font-semibold ml-1 block transition-colors",
            effectiveError ? "text-red-400" : "text-slate-400"
          )}
        >
          {label} {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* INPUT CONTAINER (Actúa como un botón gigante gracias al <label> wrapper) */}
      <label
        className={containerClasses}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          onChange={handleFileChange}
          accept={accept}
          disabled={disabled}
          className="sr-only" // Oculto accesiblemente
        />

        {/* --- ESTADO 1: SIN ARCHIVO --- */}
        {!hasFile && (
          <div className="flex items-center gap-4 w-full">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 transition-colors",
                isDragging
                  ? "text-indigo-400 bg-indigo-500/20"
                  : "text-slate-400 group-hover:text-white"
              )}
            >
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-sm">
              <span
                className={cn(
                  "font-medium transition-colors",
                  isDragging
                    ? "text-indigo-300"
                    : "text-slate-200 group-hover:text-white"
                )}
              >
                {isDragging
                  ? "Suelta el archivo aquí"
                  : "Click para subir o arrastra"}
              </span>
              <span className="text-xs text-slate-500">
                Max {maxSizeInMB}MB. Tipos:{" "}
                {accept === "*" ? "Todos" : accept.replace(/,/g, ", ")}
              </span>
            </div>
          </div>
        )}

        {/* --- ESTADO 2: CON ARCHIVO --- */}
        {hasFile && (
          <div className="flex items-center gap-4 w-full overflow-hidden">
            {/* Preview Icon / Image */}
            <div className="shrink-0 relative flex items-center justify-center">
              {isImage && previewUrl ? (
                // Imagen Thumbnail
                <div className="h-12 w-12 rounded-lg overflow-hidden border border-white/10 bg-black/20 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ) : (
                // Generic File Icon
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    effectiveError
                      ? "bg-red-500/10 text-red-400"
                      : "bg-indigo-500/10 text-indigo-400"
                  )}
                >
                  <FileText className="h-5 w-5" />
                </div>
              )}
              {/* Success/Error status indicator overlay */}
              {!effectiveError && isImage && (
                <div className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-0.5 border border-white/10">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="flex flex-col min-w-0 flex-1">
              <span
                className={cn(
                  "text-sm font-medium truncate pr-4",
                  effectiveError ? "text-red-300" : "text-slate-200"
                )}
              >
                {value.name}
              </span>
              <span
                className={cn(
                  "text-xs",
                  effectiveError ? "text-red-400" : "text-slate-500"
                )}
              >
                {formatBytes(value.size)}{" "}
                {effectiveError ? " - Error" : " - Listo"}
              </span>
            </div>

            {/* Remove Button */}
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="shrink-0 p-1 rounded-full text-slate-500 hover:text-white hover:bg-white/10 focus:outline-none transition-colors z-10 mr-1"
              >
                <XCircle
                  className={cn(
                    "h-5 w-5",
                    effectiveError && "text-red-400 hover:text-red-300"
                  )}
                />
              </button>
            )}
          </div>
        )}
      </label>

      {/* Error Message */}
      {effectiveError && (
        <div className="flex items-center gap-1.5 mt-1.5 ml-1 text-[10px] text-red-400 font-medium animate-in slide-in-from-top-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <p>{effectiveError}</p>
        </div>
      )}
    </div>
  );
};

// MEMOIZATION: Importante para rendimiento.
// Solo re-renderiza si el archivo value cambia o si hay un nuevo error externo.
export const InputFile = React.memo(InputFileComponent);
