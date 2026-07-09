import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { CertificadosTable } from "@/components/gestor/CertificadosTable";

export default async function GestorCertificadosPage() {
  const certificados = await db.certificado.findMany({
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
        description="Todos os certificados emitidos na plataforma."
      />
      <CertificadosTable certificados={certificados} />
    </div>
  );
}
