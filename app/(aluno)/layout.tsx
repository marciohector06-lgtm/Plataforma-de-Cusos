import { requireRole } from "@/lib/rbac";
import { Sidebar, type SidebarNavItem } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

const navItems: SidebarNavItem[] = [
  { href: "/aluno/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/aluno/meus-cursos", label: "Meus Cursos", icon: "BookOpen" },
  { href: "/aluno/certificados", label: "Certificados", icon: "Award" },
  { href: "/aluno/material-apoio", label: "Material de Apoio", icon: "FolderOpen" },
  { href: "/aluno/contratos", label: "Contratos", icon: "FileSignature" },
  { href: "/aluno/perfil", label: "Perfil", icon: "User" },
  { href: "/aluno/notificacoes", label: "Notificações", icon: "Bell" },
  { href: "/aluno/suporte", label: "Suporte", icon: "LifeBuoy" },
];

export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["ALUNO"]);

  return (
    <div className="flex min-h-screen">
      <Sidebar roleLabel="Área do Aluno" navItems={navItems} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          userName={session.user.name ?? "Aluno"}
          userEmail={session.user.email ?? ""}
          profileHref="/aluno/perfil"
        />
        <main className="flex-1 bg-background p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
