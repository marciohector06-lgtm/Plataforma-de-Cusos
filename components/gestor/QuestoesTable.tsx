"use client";

import { useMemo } from "react";
import { HelpCircle } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { QuestaoFormDialog } from "@/components/gestor/QuestaoFormDialog";
import type { Prisma } from "@/lib/generated/prisma/client";

type Questao = Prisma.QuestaoGetPayload<{
  include: { avaliacao: { include: { curso: true } }; alternativas: true };
}>;

export function QuestoesTable({
  questoes,
  avaliacoes,
}: {
  questoes: Questao[];
  avaliacoes: { id: string; titulo: string; cursoTitulo: string }[];
}) {
  const columns = useMemo<ColumnDef<Questao>[]>(
    () => [
      { accessorKey: "enunciado", header: "Enunciado" },
      {
        id: "avaliacao",
        header: "Avaliação",
        accessorFn: (row) => row.avaliacao.titulo,
      },
      {
        id: "curso",
        header: "Curso",
        accessorFn: (row) => row.avaliacao.curso.titulo,
      },
      {
        id: "alternativas",
        header: "Alternativas",
        accessorFn: (row) => row.alternativas.length,
      },
      { accessorKey: "ordem", header: "Ordem" },
      {
        id: "acoes",
        header: "",
        cell: ({ row }) => (
          <QuestaoFormDialog questao={row.original} avaliacoes={avaliacoes} />
        ),
      },
    ],
    [avaliacoes]
  );

  return (
    <DataTable
      columns={columns}
      data={questoes}
      searchPlaceholder="Buscar questão..."
      emptyState={{
        icon: HelpCircle,
        title: "Nenhuma questão cadastrada",
        description: "Questões de avaliações aparecerão aqui.",
      }}
    />
  );
}
