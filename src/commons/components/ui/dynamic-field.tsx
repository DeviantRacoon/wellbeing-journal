"use client";

import { InputFile } from "@/commons/components";
import { KeyValueEditor } from "@/commons/components/ui/key-value-editor";
import { Select, SelectOption } from "@/commons/components/ui/select";
import { cn } from "@/commons/libs/cn";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";

export interface VisualFieldConfig {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  options?: SelectOption[];
  colSpan?: 1 | 2;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  minLength?: number;

  // --- Props Visuales Nuevos ---
  accept?: string;
  maxSizeInMB?: number;
}

interface DynamicFieldsProps {
  form: UseFormReturn<any>;
  fields: VisualFieldConfig[];
  isLoading?: boolean;
}

const inputBaseStyles =
  "flex w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 shadow-sm transition-colors duration-200 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50";

export const DynamicFields = ({
  form,
  fields,
  isLoading = false,
}: DynamicFieldsProps) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {fields.map((fieldConfig) => {
        const {
          name,
          label,
          type = "text",
          placeholder,
          colSpan = 2,
          options,
          disabled,
          required,
          maxLength,
          accept, // <--- Destructuramos
          maxSizeInMB, // <--- Destructuramos
        } = fieldConfig;

        const error = errors[name]?.message as string | undefined;

        return (
          <div
            key={name}
            className={cn(
              "space-y-1.5",
              colSpan === 2 ? "col-span-full" : "col-span-1"
            )}
          >
            {/* LABEL (Omitimos el label en InputFile para renderizarlo unificado aquí, o usamos el del InputFile) */}
            {/* Como InputFile ya tiene su propio render de Label bonito, podemos ocultar este si es tipo file,
                O mejor aún: Pasamos el label al InputFile y ocultamos este bloque solo para files */}

            {type !== "file" && (
              <div className="flex justify-between items-center">
                <label
                  className={cn(
                    "text-xs uppercase tracking-wider font-semibold ml-1 block transition-colors",
                    error ? "text-red-400" : "text-slate-400"
                  )}
                >
                  {label}{" "}
                  {required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
              </div>
            )}

            <Controller
              control={control}
              name={name}
              render={({ field }) => {
                const currentLength = (field.value || "").toString().length;

                // --- 1. INPUT FILE INTEGRATION ---
                if (type === "file") {
                  return (
                    <InputFile
                      name={name}
                      label={label} // InputFile maneja su propio label con estilo
                      value={field.value || null} // Importante: RHF puede tener undefined, InputFile espera null
                      onChange={(file: File | null) => {
                        field.onChange(file); // Actualiza RHF
                        field.onBlur(); // Marca como tocado para validación onBlur
                      }}
                      error={error}
                      accept={accept}
                      maxSizeInMB={maxSizeInMB}
                      disabled={disabled || isLoading}
                      required={required}
                    />
                  );
                }

                // --- 1.5 KEY VALUE EDITOR ---
                if (type === "key-value") {
                  return (
                    <div className="space-y-1">
                      <KeyValueEditor
                        initialValue={field.value}
                        onChange={field.onChange}
                        title={label}
                        disabled={disabled || isLoading}
                        className={error ? "border-red-500/50" : undefined}
                      />
                      {error && (
                        <p className="text-[10px] text-red-400 font-medium px-1">
                          {error}
                        </p>
                      )}
                    </div>
                  );
                }

                // --- 2. SELECT ---
                if (type === "select") {
                  return (
                    <div className="relative">
                      <Select
                        options={options || []}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={placeholder}
                        error={error}
                        disabled={disabled || isLoading}
                        required={required}
                      />
                    </div>
                  );
                }

                // Helper para Inputs de Texto
                const renderWithHelpers = (inputElement: React.ReactNode) => (
                  <div className="relative">
                    {inputElement}
                    <div className="flex justify-between items-start mt-1 px-1">
                      <div className="flex-1">
                        {error && (
                          <p className="text-[10px] text-red-400 font-medium animate-in slide-in-from-top-1">
                            {error}
                          </p>
                        )}
                      </div>
                      {maxLength && !options && type !== "date" && (
                        <span
                          className={cn(
                            "text-[10px] tabular-nums transition-colors ml-2",
                            currentLength > maxLength
                              ? "text-red-400"
                              : "text-slate-600"
                          )}
                        >
                          {currentLength} / {maxLength}
                        </span>
                      )}
                    </div>
                  </div>
                );

                // --- 3. TEXTAREA ---
                if (type === "textarea") {
                  return renderWithHelpers(
                    <textarea
                      {...field}
                      placeholder={placeholder}
                      disabled={disabled || isLoading}
                      maxLength={maxLength}
                      className={cn(
                        inputBaseStyles,
                        "min-h-24 resize-none",
                        error &&
                          "border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-red-500/20"
                      )}
                    />
                  );
                }

                // --- 4. STANDARD INPUTS ---
                return renderWithHelpers(
                  <input
                    {...field}
                    type={type === "number" ? "tel" : type}
                    inputMode={type === "number" ? "numeric" : undefined}
                    placeholder={placeholder}
                    disabled={disabled || isLoading}
                    maxLength={maxLength}
                    onBlur={field.onBlur}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (type === "number" || type === "tel") {
                        val = val.replace(/[^0-9]/g, ""); // Bloqueo estricto
                      }
                      field.onChange(
                        type === "number" && val !== "" ? Number(val) : val
                      );
                    }}
                    className={cn(
                      inputBaseStyles,
                      "h-10",
                      error &&
                        "border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
