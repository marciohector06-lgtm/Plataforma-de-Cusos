import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { VendasTable } from "@/components/gestor/VendasTable";

export default async function GestorReembolsosPage() {
  const reembolsos = await db.venda.findMany({
    where: { status: "REEMBOLSADA" },
    include: { comprador: true, plano: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reembolsos"
        description="Vendas marcadas como reembolsadas."
      />
      <VendasTable
        vendas={reembolsos}
        searchPlaceholder="Buscar reembolso..."
        emptyState={{
          title: "Nenhum reembolso registrado",
          description: "Vendas reembolsadas aparecerão aqui.",
        }}
      />
    </div>
  );
}
