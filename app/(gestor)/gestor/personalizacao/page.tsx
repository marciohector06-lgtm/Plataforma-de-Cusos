import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalizacaoForm } from "@/components/gestor/PersonalizacaoForm";

export default async function GestorPersonalizacaoPage() {
  const personalizacao = await db.personalizacao.findUnique({
    where: { id: "singleton" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personalização"
        description="Identidade visual da plataforma (cores, logo, marca)."
      />
      <Card>
        <CardHeader>
          <CardTitle>Marca</CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalizacaoForm personalizacao={personalizacao} />
        </CardContent>
      </Card>
    </div>
  );
}
