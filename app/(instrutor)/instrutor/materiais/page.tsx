import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConteudosTable } from "@/components/gestor/ConteudosTable";

export default async function InstrutorMateriaisPage() {
  const session = await requireSession();

  const materiais = await db.conteudo.findMany({
    where: {
      curso: { autorId: session.user.id },
      tipo: { in: ["PDF", "LINK", "TEXTO"] },
    },
    include: { curso: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Materiais"
        description="Materiais de apoio (PDFs, textos e links) dos seus cursos."
      />
      <ConteudosTable
        conteudos={materiais}
        searchPlaceholder="Buscar material..."
        emptyState={{
          title: "Nenhum material cadastrado",
          description: "PDFs, textos e links de apoio aparecerão aqui.",
        }}
      />
    </div>
  );
}
