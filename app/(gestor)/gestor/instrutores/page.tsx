import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { InstrutoresTable } from "@/components/gestor/InstrutoresTable";
import { InstrutorFormDialog } from "@/components/gestor/InstrutorFormDialog";

export default async function GestorInstrutoresPage() {
  const instrutores = await db.user.findMany({
    where: { role: "INSTRUTOR" },
    include: {
      _count: { select: { cursosCriados: true, turmasLecionadas: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Instrutores"
        description="Todos os instrutores cadastrados na plataforma."
        actions={<InstrutorFormDialog />}
      />
      <InstrutoresTable instrutores={instrutores} />
    </div>
  );
}
