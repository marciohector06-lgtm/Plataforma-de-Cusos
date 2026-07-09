import { FileText } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cursoStatusLabels } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function GestorRelatoriosPage() {
  const cursos = await db.curso.findMany({
    include: {
      turmas: { include: { matriculas: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const linhas = cursos.map((curso) => {
    const matriculas = curso.turmas.flatMap((t) => t.matriculas);
    const concluidas = matriculas.filter((m) => m.status === "CONCLUIDA").length;
    const taxaConclusao =
      matriculas.length === 0 ? 0 : Math.round((concluidas / matriculas.length) * 100);

    return {
      curso,
      turmas: curso.turmas.length,
      matriculados: matriculas.length,
      concluidas,
      taxaConclusao,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        description="Panorama operacional por curso: turmas, matrículas e conclusão."
      />

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por curso</CardTitle>
        </CardHeader>
        <CardContent>
          {linhas.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nenhum curso cadastrado"
              description="Assim que um curso for criado, os relatórios aparecerão aqui."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Turmas</TableHead>
                  <TableHead>Matriculados</TableHead>
                  <TableHead>Concluídos</TableHead>
                  <TableHead>Taxa de conclusão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linhas.map((linha) => (
                  <TableRow key={linha.curso.id}>
                    <TableCell className="font-medium text-brand-navy">
                      {linha.curso.titulo}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {cursoStatusLabels[linha.curso.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{linha.turmas}</TableCell>
                    <TableCell>{linha.matriculados}</TableCell>
                    <TableCell>{linha.concluidas}</TableCell>
                    <TableCell>{linha.taxaConclusao}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
