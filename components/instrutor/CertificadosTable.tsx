"use client";

import { useMemo } from "react";
import { Award } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";

type Certificado = Prisma.CertificadoGetPayload<{
  include: { aluno: true; matricula: { include: { turma: { include: { curso: true } } } } };
}>;

export function CertificadosTable({
  certificados,
}: {
  certificados: Certificado[];
}) {
  const columns = useMemo<ColumnDef<Certificado>[]>(
    () => [
      {
        id: "aluno",
        header: "Aluno",
        accessorFn: (row) => row.aluno.name,
      },
      {
        id: "curso",
        header: "Curso",
        accessorFn: (row) => row.matricula.turma.curso.titulo,
      },
      { accessorKey: "codigoValidacao", header: "Código de validação" },
      {
        id: "dataEmissao",
        header: "Emitido em",
        accessorFn: (row) => formatDate(row.dataEmissao),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={certificados}
      searchPlaceholder="Buscar certificado..."
      emptyState={{
        icon: Award,
        title: "Nenhum certificado emitido nas suas turmas",
        description: "Assim que um certificado for emitido, ele aparecerá aqui.",
      }}
    />
  );
}
