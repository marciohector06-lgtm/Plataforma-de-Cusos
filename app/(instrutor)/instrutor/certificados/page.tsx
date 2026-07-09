import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { CertificadosTable } from "@/components/instrutor/CertificadosTable";

export default async function InstrutorCertificadosPage() {
  const session = await requireSession();

  const certificados = await db.certificado.findMany({
    where: { matricula: { turma: { instrutorId: session.user.id } } },
    include: {
      aluno: true,
      matricula: { include: { turma: { include: { curso: true } } } },
    },
    orderBy: { dataEmissao: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificados"
        description="Certificados emitidos para alunos das suas turmas."
      />
      <CertificadosTable certificados={certificados} />
    </div>
  );
}
