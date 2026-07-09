import { Bell, BellRing, Users } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { NotificacoesTable } from "@/components/gestor/NotificacoesTable";

export default async function GestorNotificacoesPage() {
  const [total, naoLidas, notificacoes] = await Promise.all([
    db.notificacao.count(),
    db.notificacao.count({ where: { lida: false } }),
    db.notificacao.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const usuariosUnicos = new Set(notificacoes.map((n) => n.userId)).size;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificações"
        description="Monitoramento de todas as notificações enviadas na plataforma."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Bell} label="Total enviadas" value={total} />
        <StatCard icon={BellRing} label="Não lidas" value={naoLidas} />
        <StatCard icon={Users} label="Usuários alcançados" value={usuariosUnicos} />
      </div>

      <NotificacoesTable notificacoes={notificacoes} />
    </div>
  );
}
