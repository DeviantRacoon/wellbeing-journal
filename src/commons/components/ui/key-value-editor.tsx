"use client";

import { Code2, GripVertical, Plus, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { cn } from "../../libs/cn";

// --- TIPOS ---

export type JsonData = Record<string, string>;

interface RowItem {
  id: string;
  key: string;
  value: string;
}

interface KeyValueEditorProps {
  initialValue?: JsonData;
  onChange: (data: JsonData) => void;
  title?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

const KeyValueRow = React.memo(
  ({
    item,
    onUpdate,
    onRemove,
    disabled,
  }: {
    item: RowItem;
    onUpdate: (id: string, field: "key" | "value", value: string) => void;
    onRemove: (id: string) => void;
    disabled?: boolean;
  }) => {
    // Handlers locales para evitar crearlos en cada render del input
    const handleChangeKey = (e: React.ChangeEvent<HTMLInputElement>) =>
      onUpdate(item.id, "key", e.target.value);

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) =>
      onUpdate(item.id, "value", e.target.value);

    return (
      <div className="group flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
        {/* Decorativo: Grip (Visual only) */}
        <div className="pt-3 text-white/10 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4" />
        </div>

        {/* KEY Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={item.key}
            onChange={handleChangeKey}
            placeholder="Clave (ej. color)"
            disabled={disabled}
            className={cn(
              "w-full h-9 rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 shadow-sm transition-all duration-200",
              "border-white/10 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 font-mono text-xs",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        </div>

        <span className="py-2 text-white/20 font-mono">:</span>

        {/* VALUE Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={item.value}
            onChange={handleChangeValue}
            placeholder="Valor"
            disabled={disabled}
            className={cn(
              "w-full h-9 rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 shadow-sm transition-all duration-200",
              "border-white/10 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        </div>

        {/* DELETE Button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={disabled}
          className={cn(
            "h-9 w-9 flex items-center justify-center rounded-lg border border-transparent text-slate-500 transition-all",
            "hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20",
            "opacity-0 group-hover:opacity-100 focus:opacity-100", // UX: Solo visible al hover
            disabled && "hidden"
          )}
          title="Eliminar campo"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  },
  // Custom comparison function para React.memo (Opcional, pero buena práctica si el objeto es complejo)
  (prev, next) =>
    prev.item.key === next.item.key &&
    prev.item.value === next.item.value &&
    prev.disabled === next.disabled
);

KeyValueRow.displayName = "KeyValueRow";

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  initialValue = {},
  onChange,
  title = "Metadatos",
  description,
  className,
  disabled = false,
}) => {
  const [rows, setRows] = useState<RowItem[]>(() =>
    Object.entries(initialValue).map(([key, value]) => ({
      id:
        typeof crypto !== "undefined"
          ? crypto.randomUUID()
          : Math.random().toString(36),
      key,
      value,
    }))
  );

  useEffect(() => {
    const jsonOutput: JsonData = {};
    let hasContent = false;

    rows.forEach((row) => {
      if (row.key.trim() !== "") {
        jsonOutput[row.key] = row.value;
        hasContent = true;
      }
    });

    onChange(jsonOutput);
  }, [rows, onChange]);

  const handleAddRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      {
        id:
          typeof crypto !== "undefined"
            ? crypto.randomUUID()
            : Math.random().toString(36),
        key: "",
        value: "",
      },
    ]);
  }, []);

  const handleRemoveRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const handleUpdateRow = useCallback(
    (id: string, field: "key" | "value", value: string) => {
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
      );
    },
    []
  );

  return (
    <div
      className={cn(
        "w-full bg-slate-950 border border-white/10 rounded-xl overflow-hidden shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 text-slate-200">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-sm tracking-wide">{title}</span>
          </div>
          {description && (
            <p className="text-[10px] text-slate-500 pl-6">{description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddRow}
          disabled={disabled}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border",
            "bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/30",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Agregar</span>
        </button>
      </div>

      {/* Body List */}
      <div className="p-4 space-y-2">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/10 rounded-lg bg-white/2">
            <p className="text-xs text-slate-500 mb-2">
              No hay propiedades definidas
            </p>
            <button
              type="button"
              onClick={handleAddRow}
              disabled={disabled}
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4 font-medium transition-colors"
            >
              Crear primera propiedad
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Labels Header (Solo si hay items) */}
            <div className="flex gap-2 px-8 mb-1">
              <span className="flex-1 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                Clave
              </span>
              <span className="w-2"></span>
              <span className="flex-1 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                Valor
              </span>
              <span className="w-9"></span>
            </div>

            {rows.map((row) => (
              <KeyValueRow
                key={row.id}
                item={row}
                onUpdate={handleUpdateRow}
                onRemove={handleRemoveRow}
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
