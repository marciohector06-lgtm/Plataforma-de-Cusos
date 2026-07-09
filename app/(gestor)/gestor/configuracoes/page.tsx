import { Settings } from "lucide-react";
import { EmDesenvolvimento } from "@/components/shared/EmDesenvolvimento";

export default function GestorConfiguracoesPage() {
  return (
    <EmDesenvolvimento
      titulo="Configurações"
      descricaoPagina="Preferências gerais da plataforma."
      icon={Settings}
      descricaoEstado="As configurações gerais (dados institucionais, preferências de conta) ainda não foram implementadas nesta fase do projeto."
    />
  );
}
