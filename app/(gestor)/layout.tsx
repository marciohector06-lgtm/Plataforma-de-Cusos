import { requireRole } from "@/lib/rbac";
import { Sidebar, type SidebarNavItem } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

const navItems: SidebarNavItem[] = [
  { href: "/gestor/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/gestor/cursos", label: "Cursos", icon: "BookOpen" },
  { href: "/gestor/turmas", label: "Turmas", icon: "Users2" },
  { href: "/gestor/matriculas", label: "Matrículas", icon: "ClipboardList" },
  { href: "/gestor/certificados", label: "Certificados", icon: "Award" },
  { href: "/gestor/avaliacoes", label: "Avaliações", icon: "ClipboardCheck" },
  { href: "/gestor/conteudos", label: "Conteúdos", icon: "Layers" },
  { href: "/gestor/materiais", label: "Materiais", icon: "Package" },
  { href: "/gestor/questionarios", label: "Questionários", icon: "HelpCircle" },
  { href: "/gestor/alunos", label: "Alunos", icon: "Users" },
  { href: "/gestor/instrutores", label: "Instrutores", icon: "GraduationCap" },
  { href: "/gestor/equipe", label: "Equipe", icon: "UsersRound" },
  { href: "/gestor/perfis-acesso", label: "Perfis de Acesso", icon: "ShieldCheck" },
  { href: "/gestor/vendas", label: "Vendas", icon: "ShoppingCart" },
  { href: "/gestor/planos", label: "Planos", icon: "Package" },
  { href: "/gestor/assinaturas", label: "Assinaturas", icon: "Repeat" },
  {
    href: "/gestor/relatorios-financeiros",
    label: "Relatórios Financeiros",
    icon: "FileBarChart",
  },
  { href: "/gestor/reembolsos", label: "Reembolsos", icon: "RotateCcw" },
  { href: "/gestor/avisos", label: "Avisos", icon: "Megaphone" },
  { href: "/gestor/emails", label: "E-mails", icon: "Mail" },
  { href: "/gestor/notificacoes", label: "Notificações", icon: "Bell" },
  { href: "/gestor/whatsapp", label: "WhatsApp", icon: "MessageCircle" },
  { href: "/gestor/relatorios", label: "Relatórios", icon: "FileText" },
  { href: "/gestor/desempenho", label: "Desempenho", icon: "TrendingUp" },
  { href: "/gestor/atividades", label: "Atividades", icon: "Activity" },
  { href: "/gestor/logs", label: "Logs", icon: "ScrollText" },
  { href: "/gestor/configuracoes", label: "Configurações", icon: "Settings" },
  { href: "/gestor/integracoes", label: "Integrações", icon: "Plug" },
  { href: "/gestor/personalizacao", label: "Personalização", icon: "Palette" },
  { href: "/gestor/parametros", label: "Parâmetros", icon: "SlidersHorizontal" },
];

export default async function GestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  return (
    <div className="flex min-h-screen">
      <Sidebar roleLabel="Painel de Gestão" navItems={navItems} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          userName={session.user.name ?? "Gestor"}
          userEmail={session.user.email ?? ""}
          profileHref="/gestor/configuracoes"
        />
        <main className="flex-1 bg-background p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
