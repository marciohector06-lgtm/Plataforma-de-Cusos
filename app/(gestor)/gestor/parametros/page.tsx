import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParametroForm } from "@/components/gestor/ParametroForm";

export default async function GestorParametrosPage() {
  const parametro = await db.parametroSistema.findUnique({
    where: { id: "singleton" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parâmetros"
        description="Regras padrão aplicadas a cursos, turmas e avaliações."
      />
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros do sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <ParametroForm parametro={parametro} />
        </CardContent>
      </Card>
    </div>
  );
}
