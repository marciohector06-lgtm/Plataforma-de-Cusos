"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { QuestaoForm } from "@/components/gestor/QuestaoForm";
import type { Prisma } from "@/lib/generated/prisma/client";

type Questao = Prisma.QuestaoGetPayload<{ include: { alternativas: true } }>;

interface QuestaoFormDialogProps {
  questao?: Questao;
  avaliacoes: { id: string; titulo: string; cursoTitulo: string }[];
}

export function QuestaoFormDialog({ questao, avaliacoes }: QuestaoFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!questao;

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? "Editar questão" : "Nova questão"}
      className="sm:max-w-xl"
      trigger={
        isEdit ? (
          <Button variant="ghost" size="icon-sm" aria-label="Editar questão">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Nova questão
          </Button>
        )
      }
    >
      <QuestaoForm questao={questao} avaliacoes={avaliacoes} onSuccess={() => setOpen(false)} />
    </FormDialog>
  );
}
