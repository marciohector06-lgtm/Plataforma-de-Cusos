"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { CursoForm } from "@/components/gestor/CursoForm";
import type { Curso } from "@/lib/generated/prisma/client";

interface CursoFormDialogProps {
  curso?: Curso;
  instrutores: { id: string; name: string }[];
}

export function CursoFormDialog({ curso, instrutores }: CursoFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!curso;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar curso" : "Novo curso"}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" aria-label="Editar curso">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Novo curso
          </Button>
        )
      }
    >
      <CursoForm curso={curso} instrutores={instrutores} onSuccess={() => setOpen(false)} />
    </FormDialog>
  );
}
