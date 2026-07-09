import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlanosTable } from "@/components/gestor/PlanosTable";
import { PlanoFormDialog } from "@/components/gestor/PlanoFormDialog";

export default async function GestorPlanosPage() {
  const planos = await db.plano.findMany({
    include: { _count: { select: { assinaturas: true, vendas: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planos"
        description="Planos de assinatura disponíveis na plataforma."
        actions={<PlanoFormDialog />}
      />
      <PlanosTable planos={planos} />
    </div>
  );
}
