import { Seo } from "@/commons/components/seo";
import JournalHistory from "../../modules/journal/history";

export default function JournalHistoryPage() {
  return (
    <>
      <Seo
        title="Historial"
        description="Revisa tu historial de bienestar y los diagnósticos de tu estado de ánimo."
      />
      <JournalHistory />
    </>
  );
}
