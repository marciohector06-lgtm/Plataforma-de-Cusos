import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { WhatsappTemplatesTable } from "@/components/gestor/WhatsappTemplatesTable";
import { WhatsappTemplateFormDialog } from "@/components/gestor/WhatsappTemplateFormDialog";

export default async function GestorWhatsappPage() {
  const templates = await db.whatsappTemplate.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp"
        description="Modelos de mensagem para uso manual (copiar e enviar). O envio automático via API do WhatsApp Business ainda não está integrado."
        actions={<WhatsappTemplateFormDialog />}
      />
      <WhatsappTemplatesTable templates={templates} />
    </div>
  );
}
