import { Mail } from "lucide-react";
import { EmDesenvolvimento } from "@/components/shared/EmDesenvolvimento";

export default function GestorEmailsPage() {
  return (
    <EmDesenvolvimento
      titulo="E-mails"
      descricaoPagina="Campanhas e histórico de e-mails transacionais."
      icon={Mail}
      descricaoEstado="O envio de e-mails depende de um provedor externo (ex: Resend) que ainda não foi configurado. Assim que a integração for feita, campanhas e histórico aparecerão aqui."
    />
  );
}
