"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// Tipos de notificaciones
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
    // Métodos directos para facilitar el uso
    toast: {
        success: (title: string, description?: string, duration?: number) => void;
        error: (title: string, description?: string, duration?: number) => void;
        warning: (title: string, description?: string, duration?: number) => void;
        info: (title: string, description?: string, duration?: number) => void;
    };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    // Callbacks estables
    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(({ type, title, description, duration = 5000 }: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, title, description, duration }]);
        // Nota: El timeout se mueve al componente visual (ToastItem) para mejor control de animaciones
    }, []);

    // OPTIMIZACIÓN CLAVE: Memoizar el objeto 'value'
    // Esto evita que todos los consumidores del contexto se re-rendericen si el estado no cambia
    const contextValue = React.useMemo(() => ({
        toasts,
        addToast,
        removeToast,
        toast: {
            success: (t: string, d?: string, dur?: number) => addToast({ type: "success", title: t, description: d, duration: dur }),
            error: (t: string, d?: string, dur?: number) => addToast({ type: "error", title: t, description: d, duration: dur }),
            warning: (t: string, d?: string, dur?: number) => addToast({ type: "warning", title: t, description: d, duration: dur }),
            info: (t: string, d?: string, dur?: number) => addToast({ type: "info", title: t, description: d, duration: dur }),
        }
    }), [toasts, addToast, removeToast]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}