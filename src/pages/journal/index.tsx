import { Seo } from "@/commons/components/seo";
import Journal from "../../modules/journal";

export default function JournalPage() {
  return (
    <>
      <Seo
        title="Nuevo Registro"
        description="Escribe en tu diario y registra cómo te sientes hoy."
      />
      <Journal />
    </>
  );
}
