"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { FieldDefinition } from "@/commons/components/types/modal-form.types";
import { Button, ButtonLoadingState } from "@/commons/components/ui/button";
import { Modal, ModalProps } from "@/commons/components/ui/modal";
import { generateZodSchema } from "@/commons/libs/schema-form";

import { DynamicFields, VisualFieldConfig } from "./dynamic-field";

interface ModalFormProps extends Omit<ModalProps, "children" | "footer"> {
  schema: FieldDefinition[];
  defaultValues?: Record<string, any>;
  onSubmit: (data: any) => Promise<void> | void;
  isLoading?: ButtonLoadingState;
  submitText?: string;
  cancelText?: string;
}

export const ModalForm = ({
  isOpen,
  onClose,
  title,
  description,
  schema: fieldDefinitions,
  defaultValues,
  onSubmit,
  isLoading = "idle",
  submitText = "Guardar",
  cancelText = "Cancelar",
  ...modalProps
}: ModalFormProps) => {
  const zodSchema = useMemo(
    () => generateZodSchema(fieldDefinitions),
    [fieldDefinitions],
  );

  const defaultValuesFromSchema = useMemo(() => {
    return fieldDefinitions.reduce(
      (acc, field) => {
        if (field.defaultValue !== undefined) {
          acc[field.key] = field.defaultValue;
        }
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [fieldDefinitions]);

  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: { ...defaultValuesFromSchema, ...(defaultValues || {}) },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isSubmitting },
  } = form;

  useEffect(() => {
    if (isOpen) {
      reset({ ...defaultValuesFromSchema, ...(defaultValues || {}) });
    }
  }, [isOpen, defaultValues, defaultValuesFromSchema, reset]);

  const formValues = useWatch({ control });

  // Transformación de datos para la UI
  const visualFields: VisualFieldConfig[] = useMemo(() => {
    return fieldDefinitions
      .filter((f) => {
        if (typeof f.hidden === "function") return !f.hidden(formValues);
        return !f.hidden;
      })
      .map((f) => ({
        name: f.key,
        label: f.label,
        type: f.type || "text",
        placeholder: f.placeholder,
        options: f.options,
        disabled: f.disabled,
        required: f.required,
        maxLength: f.maxLength,
        minLength: f.minLength,
        accept: f.accept,
        maxSizeInMB: f.maxSizeInMB,
        colSpan: f.breakpoint?.xs === 6 ? 1 : 2,
      }));
  }, [fieldDefinitions, formValues]);

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
  };

  // Determine actual loading state derived from props + internal form state
  const buttonState: ButtonLoadingState = useMemo(() => {
    if (isLoading === "success" || isLoading === "error") return isLoading;
    if (isLoading === "loading" || isSubmitting) return "loading";
    return "idle";
  }, [isLoading, isSubmitting]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={buttonState === "loading"}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            disabled={buttonState === "loading"}
            loading={buttonState}
          >
            {submitText}
          </Button>
        </>
      }
      {...modalProps}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DynamicFields
          form={form}
          fields={visualFields}
          isLoading={buttonState === "loading"}
        />
      </form>
    </Modal>
  );
};
