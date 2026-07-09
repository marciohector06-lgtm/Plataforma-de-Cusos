import { MessagesSquare } from "lucide-react";
import { EmDesenvolvimento } from "@/components/shared/EmDesenvolvimento";

export default function InstrutorMensagensPage() {
  return (
    <EmDesenvolvimento
      titulo="Mensagens"
      descricaoPagina="Converse diretamente com seus alunos."
      icon={MessagesSquare}
      descricaoEstado="A troca de mensagens entre instrutor e alunos ainda não foi implementada nesta fase do projeto."
    />
  );
}
