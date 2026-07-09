import { DollarSign } from "lucide-react";
import { EmDesenvolvimento } from "@/components/shared/EmDesenvolvimento";

export default function InstrutorFinanceiroPage() {
  return (
    <EmDesenvolvimento
      titulo="Financeiro"
      descricaoPagina="Repasses e comissões pelas suas turmas."
      icon={DollarSign}
      descricaoEstado="O cálculo de repasses por instrutor ainda não foi implementado nesta fase do projeto."
    />
  );
}
