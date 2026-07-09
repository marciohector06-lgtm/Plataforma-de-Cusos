"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { MatriculaForm } from "@/components/gestor/MatriculaForm";
import type { Matricula } from "@/lib/generated/prisma/client";

interface MatriculaFormDialogProps {
  matricula?: Matricula;
  alunos: { id: string; name: string }[];
  turmas: { id: string; nome: string; curso: { titulo: string } }[];
}

export function MatriculaFormDialog({
  matricula,
  alunos,
  turmas,
}: MatriculaFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!matricula;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar matrícula" : "Nova matrícula"}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" aria-label="Editar matrícula">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Nova matrícula
          </Button>
        )
      }
    >
      <MatriculaForm
        matricula={matricula}
        alunos={alunos}
        turmas={turmas}
        onSuccess={() => setOpen(false)}
      />
    </FormDialog>
  );
}
