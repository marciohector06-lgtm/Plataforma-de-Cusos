import { SlidersHorizontal } from "lucide-react";
import { EmDesenvolvimento } from "@/components/shared/EmDesenvolvimento";

export default function GestorParametrosPage() {
  return (
    <EmDesenvolvimento
      titulo="Parâmetros"
      descricaoPagina="Parâmetros técnicos e regras de negócio da plataforma."
      icon={SlidersHorizontal}
      descricaoEstado="Os parâmetros de sistema ainda não foram implementados nesta fase do projeto."
    />
  );
}
