"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { TurmaForm } from "@/components/gestor/TurmaForm";
import type { Turma } from "@/lib/generated/prisma/client";

interface TurmaFormDialogProps {
  turma?: Turma;
  cursos: { id: string; titulo: string }[];
  instrutores: { id: string; name: string }[];
}

export function TurmaFormDialog({ turma, cursos, instrutores }: TurmaFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!turma;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar turma" : "Nova turma"}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" aria-label="Editar turma">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Nova turma
          </Button>
        )
      }
    >
      <TurmaForm
        turma={turma}
        cursos={cursos}
        instrutores={instrutores}
        onSuccess={() => setOpen(false)}
      />
    </FormDialog>
  );
}
