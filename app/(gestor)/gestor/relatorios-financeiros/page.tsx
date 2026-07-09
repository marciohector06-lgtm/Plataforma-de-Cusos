import { DollarSign, RotateCcw, Repeat, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBRL } from "@/lib/utils";

const MESES_POR_RECORRENCIA: Record<string, number> = {
  MENSAL: 1,
  TRIMESTRAL: 3,
  ANUAL: 12,
};

export default async function GestorRelatoriosFinanceirosPage() {
  const [receitaPaga, receitaPendente, receitaReembolsada, assinaturasAtivas, planos] =
    await Promise.all([
      db.venda.aggregate({ where: { status: "PAGA" }, _sum: { valorCentavos: true } }),
      db.venda.aggregate({ where: { status: "PENDENTE" }, _sum: { valorCentavos: true } }),
      db.venda.aggregate({
        where: { status: "REEMBOLSADA" },
        _sum: { valorCentavos: true },
      }),
      db.assinatura.findMany({
        where: { status: "ATIVA" },
        include: { plano: true },
      }),
      db.plano.findMany({
        include: {
          vendas: { where: { status: "PAGA" } },
          _count: { select: { assinaturas: true } },
        },
      }),
    ]);

  const mrrCentavos = assinaturasAtivas.reduce((acc, a) => {
    const meses = MESES_POR_RECORRENCIA[a.plano.recorrencia] ?? 1;
    return acc + a.plano.precoCentavos / meses;
  }, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios Financeiros"
        description="Panorama de receita, assinaturas e reembolsos da plataforma."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Receita paga"
          value={formatBRL((receitaPaga._sum.valorCentavos ?? 0) / 100)}
        />
        <StatCard
          icon={TrendingUp}
          label="MRR estimado"
          value={formatBRL(mrrCentavos / 100)}
        />
        <StatCard
          icon={Repeat}
          label="Assinaturas ativas"
          value={assinaturasAtivas.length}
        />
        <StatCard
          icon={RotateCcw}
          label="Total reembolsado"
          value={formatBRL((receitaReembolsada._sum.valorCentavos ?? 0) / 100)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receita por plano</CardTitle>
        </CardHeader>
        <CardContent>
          {planos.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="Nenhum plano cadastrado"
              description="Assim que um plano for criado, ele aparecerá aqui."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plano</TableHead>
                  <TableHead>Assinaturas</TableHead>
                  <TableHead>Vendas pagas</TableHead>
                  <TableHead>Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planos.map((plano) => (
                  <TableRow key={plano.id}>
                    <TableCell className="font-medium text-brand-navy">
                      {plano.nome}
                    </TableCell>
                    <TableCell>{plano._count.assinaturas}</TableCell>
                    <TableCell>{plano.vendas.length}</TableCell>
                    <TableCell>
                      {formatBRL(
                        plano.vendas.reduce((acc, v) => acc + v.valorCentavos, 0) / 100
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Receita pendente (vendas ainda não confirmadas):{" "}
        {formatBRL((receitaPendente._sum.valorCentavos ?? 0) / 100)}
      </p>
    </div>
  );
}
