import { ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/lib/generated/prisma/client";

const PERFIS: {
  role: Role;
  descricao: string;
  areas: string[];
}[] = [
  {
    role: "ALUNO",
    descricao: "Acessa os cursos em que está matriculado.",
    areas: ["Dashboard", "Meus cursos", "Certificados", "Contratos", "Suporte"],
  },
  {
    role: "INSTRUTOR",
    descricao: "Gerencia os cursos e turmas que leciona.",
    areas: ["Turmas", "Conteúdos", "Avaliações", "Alunos", "Certificados"],
  },
  {
    role: "GESTOR",
    descricao: "Administra toda a operação da plataforma.",
    areas: ["Cursos", "Turmas", "Matrículas", "Financeiro", "Relatórios"],
  },
  {
    role: "ADMIN",
    descricao: "Superset do Gestor — mesmo painel, acesso total.",
    areas: ["Todas as áreas do Gestor"],
  },
];

export default async function GestorPerfisAcessoPage() {
  const contagens = await db.user.groupBy({
    by: ["role"],
    _count: { _all: true },
  });

  const totalPorRole = new Map(contagens.map((c) => [c.role, c._count._all]));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perfis de Acesso"
        description="Papéis (roles) definidos na plataforma e o que cada um pode acessar."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PERFIS.map((perfil) => (
          <StatCard
            key={perfil.role}
            icon={ShieldCheck}
            label={perfil.role}
            value={totalPorRole.get(perfil.role) ?? 0}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PERFIS.map((perfil) => (
          <Card key={perfil.role}>
            <CardHeader>
              <CardTitle>{perfil.role}</CardTitle>
              <CardDescription>{perfil.descricao}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {perfil.areas.map((area) => (
                <Badge key={area} variant="outline">
                  {area}
                </Badge>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
