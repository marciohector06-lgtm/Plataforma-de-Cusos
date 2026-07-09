"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { EquipeForm } from "@/components/gestor/EquipeForm";
import type { Role } from "@/lib/generated/prisma/client";

interface EquipeFormDialogProps {
  membro?: { id: string; name: string; role: Role };
}

export function EquipeFormDialog({ membro }: EquipeFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!membro;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar membro da equipe" : "Novo membro da equipe"}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" aria-label="Editar membro">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Adicionar membro
          </Button>
        )
      }
    >
      <EquipeForm membro={membro} onSuccess={() => setOpen(false)} />
    </FormDialog>
  );
}
