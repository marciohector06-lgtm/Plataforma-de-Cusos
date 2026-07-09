"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { InstrutorForm } from "@/components/gestor/InstrutorForm";

interface InstrutorFormDialogProps {
  instrutor?: { id: string; name: string };
}

export function InstrutorFormDialog({ instrutor }: InstrutorFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!instrutor;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar instrutor" : "Novo instrutor"}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" aria-label="Editar instrutor">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Adicionar instrutor
          </Button>
        )
      }
    >
      <InstrutorForm instrutor={instrutor} onSuccess={() => setOpen(false)} />
    </FormDialog>
  );
}
