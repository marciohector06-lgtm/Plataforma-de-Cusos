import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { AssinaturasTable } from "@/components/gestor/AssinaturasTable";

export default async function GestorAssinaturasPage() {
  const assinaturas = await db.assinatura.findMany({
    include: { user: true, plano: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assinaturas"
        description="Assinaturas ativas e históricas na plataforma."
      />
      <AssinaturasTable assinaturas={assinaturas} />
    </div>
  );
}
