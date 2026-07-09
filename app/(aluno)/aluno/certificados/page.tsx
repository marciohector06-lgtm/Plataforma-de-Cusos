import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { CertificadosTable } from "@/components/aluno/CertificadosTable";

export default async function CertificadosPage() {
  const session = await requireSession();

  const certificados = await db.certificado.findMany({
    where: { alunoId: session.user.id },
    include: { matricula: { include: { turma: { include: { curso: true } } } } },
    orderBy: { dataEmissao: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificados"
        description="Certificados emitidos para os cursos que você concluiu."
      />
      <CertificadosTable data={certificados} />
    </div>
  );
}
