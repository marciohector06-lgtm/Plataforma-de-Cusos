import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConteudosTable } from "@/components/gestor/ConteudosTable";

export default async function InstrutorConteudosPage() {
  const session = await requireSession();

  const conteudos = await db.conteudo.findMany({
    where: { curso: { autorId: session.user.id } },
    include: { curso: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conteúdos"
        description="Conteúdos cadastrados nos cursos que você criou."
      />
      <ConteudosTable conteudos={conteudos} />
    </div>
  );
}
