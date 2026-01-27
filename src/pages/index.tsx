import { Seo } from "@/commons/components/seo";
import Home from "@/modules/journal/home";

export default function IndexPage() {
  return (
    <>
      <Seo
        title="Inicio"
        description="Monitor de estado de ánimo y asistente psicológico personal."
      />
      <Home />
    </>
  );
}
