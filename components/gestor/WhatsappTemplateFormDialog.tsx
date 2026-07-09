"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { WhatsappTemplateForm } from "@/components/gestor/WhatsappTemplateForm";
import type { WhatsappTemplate } from "@/lib/generated/prisma/client";

interface WhatsappTemplateFormDialogProps {
  template?: WhatsappTemplate;
}

export function WhatsappTemplateFormDialog({ template }: WhatsappTemplateFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!template;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar modelo" : "Novo modelo de WhatsApp"}
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
      <WhatsappTemplateForm template={template} onSuccess={() => setOpen(false)} />
    </FormDialog>
  );
}
