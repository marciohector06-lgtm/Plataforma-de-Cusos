import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { PerfilForm } from "@/components/aluno/PerfilForm";
import { roleLabels } from "@/lib/utils";

export default async function PerfilPage() {
  const session = await requireSession();

  const user = await db.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meu Perfil"
        description="Atualize suas informações pessoais."
      />
      <PerfilForm
        defaultValues={{ name: user.name, avatarUrl: user.avatarUrl ?? "" }}
        email={user.email}
        role={roleLabels[user.role]}
      />
    </div>
  );
}
