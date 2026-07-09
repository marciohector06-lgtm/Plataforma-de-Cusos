import {
  Activity,
  Award,
  ClipboardList,
  FileSignature,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDateTime } from "@/lib/utils";

type Evento = {
  id: string;
  icon: LucideIcon;
  descricao: string;
  data: Date;
};

export default async function GestorAtividadesPage() {
  const [matriculas, vendas, contratosAssinados, novosUsuarios, certificados] =
    await Promise.all([
      db.matricula.findMany({
        include: { aluno: true, turma: { include: { curso: true } } },
        orderBy: { createdAt: "desc" },
        take: 15,
      }),
      db.venda.findMany({
        include: { comprador: true },
        orderBy: { createdAt: "desc" },
        take: 15,
      }),
      db.contrato.findMany({
        where: { status: "ASSINADO", assinadoEm: { not: null } },
        include: { aluno: true },
        orderBy: { assinadoEm: "desc" },
        take: 15,
      }),
      db.user.findMany({ orderBy: { createdAt: "desc" }, take: 15 }),
      db.certificado.findMany({
        include: { aluno: true },
        orderBy: { dataEmissao: "desc" },
        take: 15,
      }),
    ]);

  const eventos: Evento[] = [
    ...matriculas.map((m) => ({
      id: `matricula-${m.id}`,
      icon: ClipboardList,
      descricao: `${m.aluno.name} se matriculou em ${m.turma.curso.titulo}`,
      data: m.createdAt,
    })),
    ...vendas.map((v) => ({
      id: `venda-${v.id}`,
      icon: ShoppingCart,
      descricao: `${v.comprador.name} — ${v.descricao}`,
      data: v.createdAt,
    })),
    ...contratosAssinados.map((c) => ({
      id: `contrato-${c.id}`,
      icon: FileSignature,
      descricao: `${c.aluno.name} assinou um contrato`,
      data: c.assinadoEm as Date,
    })),
    ...novosUsuarios.map((u) => ({
      id: `user-${u.id}`,
      icon: UserPlus,
      descricao: `${u.name} entrou na plataforma`,
      data: u.createdAt,
    })),
    ...certificados.map((c) => ({
      id: `cert-${c.id}`,
      icon: Award,
      descricao: `Certificado emitido para ${c.aluno.name}`,
      data: c.dataEmissao,
    })),
  ].sort((a, b) => b.data.getTime() - a.data.getTime());

  const recentes = eventos.slice(0, 30);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Atividades"
        description="Últimos eventos registrados na plataforma."
      />

      {recentes.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="Nenhuma atividade registrada"
          description="Eventos recentes da plataforma aparecerão aqui."
        />
      ) : (
        <div className="space-y-2">
          {recentes.map((evento) => {
            const Icon = evento.icon;
            return (
              <div
                key={evento.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
                  <Icon className="size-4" aria-hidden />
                </div>
                <p className="min-w-0 flex-1 truncate text-sm text-brand-navy">
                  {evento.descricao}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDateTime(evento.data)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
