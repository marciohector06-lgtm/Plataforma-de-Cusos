import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConteudosTable } from "@/components/gestor/ConteudosTable";
import { ConteudoFormDialog } from "@/components/gestor/ConteudoFormDialog";

const TIPOS_MATERIAL = ["PDF", "LINK", "TEXTO"] as const;

export default async function GestorMateriaisPage() {
  const [materiais, cursos] = await Promise.all([
    db.conteudo.findMany({
      where: { tipo: { in: [...TIPOS_MATERIAL] } },
      include: { curso: true },
      orderBy: { createdAt: "desc" },
    }),
    db.curso.findMany({ select: { id: true, titulo: true }, orderBy: { titulo: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Materiais"
        description="Materiais de apoio (PDFs, textos e links) disponibilizados nos cursos."
        actions={
          <ConteudoFormDialog
            cursos={cursos}
            tiposPermitidos={[...TIPOS_MATERIAL]}
            triggerLabel="Novo material"
          />
        }
      />
      <ConteudosTable
        conteudos={materiais}
        cursos={cursos}
        tiposPermitidos={[...TIPOS_MATERIAL]}
        searchPlaceholder="Buscar material..."
        emptyState={{
          title: "Nenhum material cadastrado",
          description: "PDFs, textos e links de apoio aparecerão aqui.",
        }}
      />
    </div>
  );
}
