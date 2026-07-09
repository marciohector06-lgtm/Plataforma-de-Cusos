import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export function EmDesenvolvimento({
  titulo,
  descricaoPagina,
  icon,
  descricaoEstado,
}: {
  titulo: string;
  descricaoPagina: string;
  icon: LucideIcon;
  descricaoEstado: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={titulo} description={descricaoPagina} />
      <EmptyState
        icon={icon}
        title="Funcionalidade em desenvolvimento"
        description={descricaoEstado}
      />
    </div>
  );
}
