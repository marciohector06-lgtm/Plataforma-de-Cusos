import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { EquipeTable } from "@/components/gestor/EquipeTable";
import { EquipeFormDialog } from "@/components/gestor/EquipeFormDialog";

export default async function GestorEquipePage() {
  const membros = await db.user.findMany({
    where: { role: { in: ["GESTOR", "ADMIN"] } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipe"
        description="Gestores e administradores com acesso ao painel."
        actions={<EquipeFormDialog />}
      />
      <EquipeTable membros={membros} />
    </div>
  );
}
