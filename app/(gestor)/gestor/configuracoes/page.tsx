import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfiguracaoForm } from "@/components/gestor/ConfiguracaoForm";

export default async function GestorConfiguracoesPage() {
  const configuracao = await db.configuracaoPlataforma.findUnique({
    where: { id: "singleton" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Preferências gerais da plataforma."
      />
      <Card>
        <CardHeader>
          <CardTitle>Dados institucionais</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfiguracaoForm configuracao={configuracao} />
        </CardContent>
      </Card>
    </div>
  );
}
