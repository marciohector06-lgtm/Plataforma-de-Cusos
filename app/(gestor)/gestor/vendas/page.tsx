import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { VendasTable } from "@/components/gestor/VendasTable";

export default async function GestorVendasPage() {
  const vendas = await db.venda.findMany({
    include: { comprador: true, plano: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendas"
        description="Todas as vendas registradas na plataforma."
      />
      <VendasTable vendas={vendas} />
    </div>
  );
}
