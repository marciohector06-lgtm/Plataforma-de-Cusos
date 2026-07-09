import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmailTemplatesTable } from "@/components/gestor/EmailTemplatesTable";
import { EmailTemplateFormDialog } from "@/components/gestor/EmailTemplateFormDialog";

export default async function GestorEmailsPage() {
  const templates = await db.emailTemplate.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <PageHeader
        title="E-mails"
        description="Modelos de e-mail para uso futuro. O envio automático depende de um provedor externo (ex: Resend) que ainda não foi configurado."
        actions={<EmailTemplateFormDialog />}
      />
      <EmailTemplatesTable templates={templates} />
    </div>
  );
}
