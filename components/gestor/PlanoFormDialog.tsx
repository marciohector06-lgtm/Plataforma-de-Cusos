"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { PlanoForm } from "@/components/gestor/PlanoForm";
import type { Plano } from "@/lib/generated/prisma/client";

interface PlanoFormDialogProps {
  plano?: Plano;
}

export function PlanoFormDialog({ plano }: PlanoFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!plano;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar plano" : "Novo plano"}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" aria-label="Editar plano">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Novo plano
          </Button>
        )
      }
    >
      <PlanoForm plano={plano} onSuccess={() => setOpen(false)} />
    </FormDialog>
  );
}
