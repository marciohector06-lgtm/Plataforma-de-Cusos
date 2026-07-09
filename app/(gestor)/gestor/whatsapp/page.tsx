import { MessageCircle } from "lucide-react";
import { EmDesenvolvimento } from "@/components/shared/EmDesenvolvimento";

export default function GestorWhatsappPage() {
  return (
    <EmDesenvolvimento
      titulo="WhatsApp"
      descricaoPagina="Mensagens e automações via WhatsApp."
      icon={MessageCircle}
      descricaoEstado="A integração com a API do WhatsApp ainda não foi configurada. Assim que estiver disponível, o envio e histórico de mensagens aparecerão aqui."
    />
  );
}
