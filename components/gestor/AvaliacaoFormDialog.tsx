"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { AvaliacaoForm } from "@/components/gestor/AvaliacaoForm";
import type { Avaliacao } from "@/lib/generated/prisma/client";

interface AvaliacaoFormDialogProps {
  avaliacao?: Avaliacao;
  cursos: { id: string; titulo: string }[];
}

export function AvaliacaoFormDialog({ avaliacao, cursos }: AvaliacaoFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!avaliacao;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar avaliação" : "Nova avaliação"}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" aria-label="Editar avaliação">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Nova avaliação
          </Button>
        )
      }
    >
      <AvaliacaoForm avaliacao={avaliacao} cursos={cursos} onSuccess={() => setOpen(false)} />
    </FormDialog>
  );
}
