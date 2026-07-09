import { Plug } from "lucide-react";
import { EmDesenvolvimento } from "@/components/shared/EmDesenvolvimento";

export default function GestorIntegracoesPage() {
  return (
    <EmDesenvolvimento
      titulo="Integrações"
      descricaoPagina="Conexões com serviços externos (pagamento, e-mail, WhatsApp)."
      icon={Plug}
      descricaoEstado="A gestão de integrações com serviços de terceiros ainda não foi implementada nesta fase do projeto."
    />
  );
}
