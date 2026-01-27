"use client";

import { ConfirmModal } from "@/commons/components/ui/confirm-modal";
import { ReactNode, useCallback, useMemo, useState } from "react";

interface UseConfirmModalOptions {
  initialOpen?: boolean;
  title?: string;
  description?: ReactNode;
  onConfirm?: () => Promise<void> | void;
  variant?: "danger" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
}

export function useConfirmModal(options: UseConfirmModalOptions = {}) {
  const [isOpen, setIsOpen] = useState(options.initialOpen ?? false);
  const [isLoading, setIsLoading] = useState(false);

  // State for dynamic content if needed per-trigger
  const [config, setConfig] = useState(options);

  const openModal = useCallback(
    (triggerOptions?: Partial<UseConfirmModalOptions>) => {
      if (triggerOptions) {
        setConfig((prev) => ({ ...prev, ...triggerOptions }));
      }
      setIsOpen(true);
    },
    []
  ); // Sin dependencias - usa setConfig con función

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!config.onConfirm) return;

    try {
      setIsLoading(true);
      await config.onConfirm();
      closeModal();
    } catch (error) {
      console.error("Confirm action failed:", error);
      setIsLoading(false);
    }
  }, [config.onConfirm, closeModal]);

  // OPTIMIZACIÓN: Memoizar el componente modal
  const ModalComponent = useMemo(
    () => (
      <ConfirmModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={config.title || "Confirm Action"}
        description={config.description || "Are you sure you want to proceed?"}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        variant={config.variant}
        isLoading={isLoading}
      />
    ),
    [
      isOpen,
      closeModal,
      handleConfirm,
      config.title,
      config.description,
      config.confirmText,
      config.cancelText,
      config.variant,
      isLoading,
    ]
  );

  return {
    isOpen,
    openModal,
    closeModal,
    ConfirmModal: ModalComponent,
    isLoading,
  };
}
