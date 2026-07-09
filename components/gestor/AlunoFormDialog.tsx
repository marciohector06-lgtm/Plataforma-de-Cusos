"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { AlunoForm } from "@/components/gestor/AlunoForm";

interface AlunoFormDialogProps {
  aluno?: { id: string; name: string };
}

export function AlunoFormDialog({ aluno }: AlunoFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!aluno;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar aluno" : "Novo aluno"}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" aria-label="Editar aluno">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Adicionar aluno
          </Button>
        )
      }
    >
      <AlunoForm aluno={aluno} onSuccess={() => setOpen(false)} />
    </FormDialog>
  );
}
