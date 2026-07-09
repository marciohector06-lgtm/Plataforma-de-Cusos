"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { EmailTemplateForm } from "@/components/gestor/EmailTemplateForm";
import type { EmailTemplate } from "@/lib/generated/prisma/client";

interface EmailTemplateFormDialogProps {
  template?: EmailTemplate;
}

export function EmailTemplateFormDialog({ template }: EmailTemplateFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!template;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar modelo" : "Novo modelo de e-mail"}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" aria-label="Editar modelo">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Novo modelo
          </Button>
        )
      }
    >
      <EmailTemplateForm template={template} onSuccess={() => setOpen(false)} />
    </FormDialog>
  );
}
