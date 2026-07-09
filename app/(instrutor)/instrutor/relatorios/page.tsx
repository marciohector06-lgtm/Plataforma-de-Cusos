import { FileText } from "lucide-react";
import { requireSession } from "@/lib/rbac";
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
import { Badge } from "@/components/ui/badge";
import { turmaStatusLabels } from "@/lib/utils";

export default async function InstrutorRelatoriosPage() {
  const session = await requireSession();

  const turmas = await db.turma.findMany({
    where: { instrutorId: session.user.id },
    include: { curso: true, matriculas: true },
    orderBy: { dataInicio: "desc" },
  });

  const linhas = turmas.map((turma) => {
    const concluidas = turma.matriculas.filter((m) => m.status === "CONCLUIDA").length;
    const taxaConclusao =
      turma.matriculas.length === 0
        ? 0
        : Math.round((concluidas / turma.matriculas.length) * 100);

    return { turma, concluidas, taxaConclusao };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        description="Panorama das suas turmas: matrículas e conclusão."
      />

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por turma</CardTitle>
        </CardHeader>
        <CardContent>
          {linhas.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nenhuma turma atribuída"
              description="Assim que uma turma for atribuída a você, os relatórios aparecerão aqui."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turma</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Matriculados</TableHead>
                  <TableHead>Concluídos</TableHead>
                  <TableHead>Taxa de conclusão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linhas.map(({ turma, concluidas, taxaConclusao }) => (
                  <TableRow key={turma.id}>
                    <TableCell className="font-medium text-brand-navy">
                      {turma.curso.titulo} — {turma.nome}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{turmaStatusLabels[turma.status]}</Badge>
                    </TableCell>
                    <TableCell>{turma.matriculas.length}</TableCell>
                    <TableCell>{concluidas}</TableCell>
                    <TableCell>{taxaConclusao}%</TableCell>
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
