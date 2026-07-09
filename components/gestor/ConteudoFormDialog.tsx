"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConteudoForm } from "@/components/gestor/ConteudoForm";
import type { Conteudo, ConteudoTipo } from "@/lib/generated/prisma/client";

interface ConteudoFormDialogProps {
  conteudo?: Conteudo;
  cursos: { id: string; titulo: string }[];
  tiposPermitidos?: ConteudoTipo[];
  triggerLabel?: string;
}

export function ConteudoFormDialog({
  conteudo,
  cursos,
  tiposPermitidos,
  triggerLabel = "Adicionar conteúdo",
}: ConteudoFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!conteudo;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar conteúdo" : "Novo conteúdo"}
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" aria-label="Editar conteúdo">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            {triggerLabel}
          </Button>
        )
      }
    >
      <ConteudoForm
        conteudo={conteudo}
        cursos={cursos}
        tiposPermitidos={tiposPermitidos}
        onSuccess={() => setOpen(false)}
      />
    </FormDialog>
  );
}
