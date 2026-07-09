import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConteudosTable } from "@/components/gestor/ConteudosTable";
import { ConteudoFormDialog } from "@/components/gestor/ConteudoFormDialog";

export default async function GestorConteudosPage() {
  const [conteudos, cursos] = await Promise.all([
    db.conteudo.findMany({
      include: { curso: true },
      orderBy: { createdAt: "desc" },
    }),
    db.curso.findMany({ select: { id: true, titulo: true }, orderBy: { titulo: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conteúdos"
        description="Todos os conteúdos cadastrados nos cursos da plataforma."
        actions={<ConteudoFormDialog cursos={cursos} triggerLabel="Novo conteúdo" />}
      />
      <ConteudosTable conteudos={conteudos} cursos={cursos} />
    </div>
  );
}
