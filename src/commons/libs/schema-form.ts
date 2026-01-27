import { FieldDefinition } from "@/commons/components/types/modal-form.types";
import { z } from "zod";

export const generateZodSchema = (fields: FieldDefinition[]) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    if (field.hidden === true) return;

    let validator: any;

    if (field.type === "number") {
      validator = z.coerce.number();
    } else if (field.type === "file") {
      validator = z.any();
    } else if (field.type === "email") {
      validator = z.string();
    } else if (field.type === "key-value") {
      validator = z.record(z.string(), z.string());
    } else if (
      !field.type ||
      ["text", "password", "textarea", "tel", "date"].includes(field.type)
    ) {
      validator = z.string();
    } else {
      // Default / Select: string | number
      validator = z.union([z.string(), z.number()]);
    }

    if (field.required) {
      if (field.type === "number") {
        validator = validator.refine(
          (val: any) =>
            val !== undefined && val !== null && !isNaN(val) && val !== 0,
          { message: "Este campo es requerido" }
        );
      } else if (field.type === "file") {
        validator = validator.refine((val: any) => val instanceof File, {
          message: "Debes subir un archivo",
        });
      } else if (field.type === "key-value") {
        validator = validator.refine(
          (val: any) =>
            val !== undefined && val !== null && Object.keys(val).length > 0,
          { message: "Debes agregar al menos un elemento" }
        );
      } else {
        validator = validator.refine(
          (val: any) => val !== undefined && val !== null && val !== "",
          { message: "Este campo es requerido" }
        );
      }
    } else {
      if (field.type === "number") {
        validator = validator.optional();
      } else if (field.type === "file") {
        validator = validator.optional().nullable();
      } else {
        validator = validator.optional().or(z.literal(""));
      }
    }

    if (field.type === "email") {
      validator = validator.email({ message: "Correo inválido" });
    }

    if (field.minLength) {
      validator = validator.min(field.minLength, {
        message: `Mínimo ${field.minLength} caracteres`,
      });
    }

    if (field.maxLength) {
      validator = validator.max(field.maxLength, {
        message: `Máximo ${field.maxLength} caracteres`,
      });
    }

    // PATTERN (Regex)
    if (field.pattern) {
      validator = validator.regex(field.pattern.value, {
        message: field.pattern.message || "Formato inválido",
      });
    }

    schemaShape[field.key] = validator;
  });

  return z.object(schemaShape);
};
