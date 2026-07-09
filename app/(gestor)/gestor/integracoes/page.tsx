import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { IntegracoesTable } from "@/components/gestor/IntegracoesTable";
import { IntegracaoFormDialog } from "@/components/gestor/IntegracaoFormDialog";

export default async function GestorIntegracoesPage() {
  const integracoes = await db.integracao.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrações"
        description="Conexões com serviços externos (pagamento, e-mail, WhatsApp)."
        actions={<IntegracaoFormDialog />}
      />
      <IntegracoesTable integracoes={integracoes} />
    </div>
  );
}
