"use client";

import { cn } from "@/commons/libs/cn";
import { Check, ChevronDown, Search } from "lucide-react";
import React, {
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export const Select = ({
  label,
  placeholder = "Seleccionar...",
  options,
  value,
  onChange,
  error,
  disabled,
  className,
  required,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 1. Filtrado
  const filteredOptions = useMemo(() => {
    // Agregar opción predeterminada siempre al inicio
    const defaultOption: SelectOption = {
      value: "",
      label: "Selecciona una opción",
      disabled: true,
    };

    const allOptions = [defaultOption, ...options];

    if (!search) return allOptions;
    const selected = options.find((opt) => opt.value === value);
    if (selected && search === selected.label) return allOptions;

    return allOptions.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search, value]);

  // 2. Sincronización
  useEffect(() => {
    const selectedOption = options.find((opt) => opt.value === value);
    if (selectedOption) {
      setSearch(selectedOption.label);
    }
  }, [value, options]);

  // 3. Highlight reset
  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  // 4. Scroll automático
  useEffect(() => {
    if (isOpen && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex, isOpen]);

  // 5. Posicionamiento del Dropdown
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const updatePosition = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        // El input wrapper es el segundo hijo (el primero es el label si existe).
        // Pero queremos alinearnos con el input-wrapper específicamente o con el contenedor completo?
        // El diseño original ponía el dropdown relative al contenedor.
        // Vamos a calcular base al input real para ser más precisos, o al container.
        // Container tiene el width full.

        // Ajustamos rects considerando scroll actual de window
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      };

      updatePosition();
      // Opcional: Escuchar resize/scroll para actualizar posición en tiempo real
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [isOpen]);

  // 6. Clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is inside input container
      const isInsideContainer =
        containerRef.current &&
        containerRef.current.contains(event.target as Node);

      // Check if click is inside portal dropdown
      const isInsideDropdown =
        listRef.current && listRef.current.contains(event.target as Node);

      if (!isInsideContainer && !isInsideDropdown) {
        setIsOpen(false);
        const selectedOption = options.find((opt) => opt.value === value);
        setSearch(selectedOption ? selectedOption.label : "");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, options]); // Dependencias mínimas para evitar re-binds innecesarios

  // --- HANDLERS ---

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setSearch(option.label);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && filteredOptions.length > 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) setIsOpen(true);
    if (e.target.value === "") onChange("");
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full space-y-2", className)}
    >
      {/* Label */}
      {label && (
        <label
          className={cn(
            "text-xs uppercase tracking-wider font-semibold ml-1 block transition-colors",
            error ? "text-red-400" : "text-slate-400"
          )}
        >
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            // --- LAYOUT & BASE ---
            "flex h-10 w-full rounded-lg px-3 py-2 pr-10 text-sm shadow-sm",

            // --- GLASS STYLE ---
            "bg-white/5 text-white placeholder:text-white/30",

            // --- TRANSICIONES ---
            "transition-colors duration-200",

            // --- BORDES & FOCUS ---
            "border border-white/10",
            "focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50",

            // --- ERROR ---
            error &&
              "border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-red-500/20",

            // --- DISABLED ---
            disabled && "cursor-not-allowed opacity-50 select-none"
          )}
        />

        {/* Chevron Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Dropdown Menu (Portal) */}
      {isOpen &&
        !disabled &&
        createPortal(
          <div
            ref={listRef}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
            className={cn(
              "fixed z-9999 mt-2 max-h-60 overflow-y-auto rounded-xl p-1 shadow-2xl animate-in fade-in zoom-in-95",
              // Fondo Glass fuerte
              "bg-slate-950/90 backdrop-blur-xl",
              // Borde brillante sutil
              "border border-white/10"
            )}
            onMouseDown={(e) => e.preventDefault()}
          >
            {filteredOptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-xs text-slate-500">
                <Search className="w-8 h-8 mb-2 opacity-20" />
                <p>Sin resultados</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {filteredOptions.map((option, index) => {
                  const isSelected = value === option.value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      ref={(el) => {
                        optionRefs.current[index] = el;
                      }}
                      onClick={() => {
                        if (option.disabled) return;
                        handleSelect(option);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-9 text-sm outline-none transition-all duration-200",

                        // Estado Base
                        "text-slate-300",

                        // Hover / Highlight (Teclado)
                        isHighlighted && !isSelected && "bg-white/5 text-white",

                        // Estado Seleccionado
                        isSelected &&
                          "bg-indigo-500/20 text-indigo-300 font-medium",

                        // Estado Disabled
                        option.disabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <span className="truncate">{option.label}</span>

                      {isSelected && (
                        <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center animate-in zoom-in text-indigo-400">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>,
          document.body
        )}

      {/* Error Text */}
      {error && (
        <p className="text-[10px] text-red-400 font-medium animate-in slide-in-from-top-1 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};
