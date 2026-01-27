import { SelectOption } from "@/commons/components/ui/select";

// Agregamos "file" a los tipos permitidos
export type InputType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "number"
  | "date"
  | "select"
  | "textarea"
  | "checkbox"
  | "file"
  | "key-value";

export interface FieldDefinition {
  key: string;
  label: string;
  type?: InputType;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: {
    value: RegExp;
    message: string;
  };
  placeholder?: string;
  options?: SelectOption[];
  hidden?: boolean | ((values: any) => boolean);
  disabled?: boolean;
  breakpoint?: { xs: number };

  accept?: string;
  maxSizeInMB?: number;
  defaultValue?: any;
}
