"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import type {
  Certificado,
  Matricula,
  Turma,
  Curso,
} from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";

type CertificadoRow = Certificado & {
  matricula: Matricula & { turma: Turma & { curso: Curso } };
};

export function CertificadosTable({ data }: { data: CertificadoRow[] }) {
  const columns = useMemo<ColumnDef<CertificadoRow>[]>(
    () => [
      {
        id: "curso",
        accessorFn: (row) => row.matricula.turma.curso.titulo,
        header: "Curso",
      },
      {
        id: "turma",
        accessorFn: (row) => row.matricula.turma.nome,
        header: "Turma",
      },
      {
        id: "codigoValidacao",
        accessorFn: (row) => row.codigoValidacao,
        header: "Código de validação",
      },
      {
        id: "dataEmissao",
        header: "Emitido em",
        cell: ({ row }) => formatDate(row.original.dataEmissao),
      },
      {
        id: "acoes",
        header: "",
        cell: ({ row }) =>
          row.original.urlArquivo ? (
            <Button
              variant="outline"
              size="sm"
              render={<a href={row.original.urlArquivo} target="_blank" />}
            >
              <Download className="size-4" />
              Baixar
            </Button>
          ) : null,
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar por curso ou código..."
      emptyState={{
        icon: Award,
        title: "Nenhum certificado emitido ainda",
        description:
          "Conclua uma turma para que seu certificado apareça aqui.",
      }}
    />
  );
}
