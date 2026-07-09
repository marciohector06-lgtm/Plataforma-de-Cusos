import { requireRole } from "@/lib/rbac";
import { Sidebar, type SidebarNavItem } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

const navItems: SidebarNavItem[] = [
  { href: "/instrutor/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/instrutor/meus-cursos", label: "Meus Cursos", icon: "BookOpen" },
  { href: "/instrutor/turmas", label: "Turmas", icon: "Users2" },
  { href: "/instrutor/conteudos", label: "Conteúdos", icon: "Layers" },
  { href: "/instrutor/alunos", label: "Alunos", icon: "Users" },
  { href: "/instrutor/avaliacoes", label: "Avaliações", icon: "ClipboardCheck" },
  { href: "/instrutor/certificados", label: "Certificados", icon: "Award" },
  { href: "/instrutor/agenda", label: "Agenda", icon: "Calendar" },
  { href: "/instrutor/materiais", label: "Materiais", icon: "FolderOpen" },
  { href: "/instrutor/relatorios", label: "Relatórios", icon: "FileBarChart" },
  { href: "/instrutor/financeiro", label: "Financeiro", icon: "DollarSign" },
  { href: "/instrutor/perfil", label: "Perfil", icon: "User" },
  { href: "/instrutor/mensagens", label: "Mensagens", icon: "MessageSquare" },
  { href: "/instrutor/notificacoes", label: "Notificações", icon: "Bell" },
  { href: "/instrutor/suporte", label: "Suporte", icon: "LifeBuoy" },
];

export default async function InstrutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["INSTRUTOR"]);

  return (
    <div className="flex min-h-screen">
      <Sidebar roleLabel="Área do Instrutor" navItems={navItems} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          userName={session.user.name ?? "Instrutor"}
          userEmail={session.user.email ?? ""}
          profileHref="/instrutor/perfil"
        />
        <main className="flex-1 bg-background p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
