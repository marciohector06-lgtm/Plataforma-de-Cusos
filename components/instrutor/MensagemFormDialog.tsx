"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/shared/FormDialog";
import { MensagemForm } from "@/components/instrutor/MensagemForm";

interface MensagemFormDialogProps {
  alunos: { id: string; name: string }[];
}

export function MensagemFormDialog({ alunos }: MensagemFormDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title="Nova mensagem"
      trigger={
        <Button size="sm">
          <Plus className="size-4" />
          Nova mensagem
        </Button>
      }
    >
      <MensagemForm alunos={alunos} onSuccess={() => setOpen(false)} />
    </FormDialog>
  );
}
