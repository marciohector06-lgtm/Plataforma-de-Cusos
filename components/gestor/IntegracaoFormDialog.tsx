"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { IntegracaoForm } from "@/components/gestor/IntegracaoForm";
import type { Integracao } from "@/lib/generated/prisma/client";

interface IntegracaoFormDialogProps {
  integracao?: Integracao;
}

export function IntegracaoFormDialog({ integracao }: IntegracaoFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!integracao;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar integração" : "Nova integração"}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" aria-label="Editar integração">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Nova integração
          </Button>
        )
      }
    >
      <IntegracaoForm integracao={integracao} onSuccess={() => setOpen(false)} />
    </FormDialog>
  );
}
