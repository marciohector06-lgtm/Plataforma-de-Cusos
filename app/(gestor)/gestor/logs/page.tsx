import { ScrollText } from "lucide-react";
import { EmDesenvolvimento } from "@/components/shared/EmDesenvolvimento";

export default function GestorLogsPage() {
  return (
    <EmDesenvolvimento
      titulo="Logs"
      descricaoPagina="Registro de auditoria de ações realizadas na plataforma."
      icon={ScrollText}
      descricaoEstado="O registro de auditoria (quem fez o quê e quando) ainda não foi implementado nesta fase do projeto."
    />
  );
}
