"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  Award,
  Bell,
  BookOpen,
  Calendar,
  ClipboardCheck,
  ClipboardList,
  DollarSign,
  FileBarChart,
  FileSignature,
  FileText,
  FolderOpen,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Layers,
  LifeBuoy,
  Mail,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  Package,
  Palette,
  Plug,
  Repeat,
  RotateCcw,
  ScrollText,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  TrendingUp,
  User,
  Users,
  Users2,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// Sidebar é Client Component: ícones não podem vir como referência de função de
// um Server Component (layout), então os navItems passam só o nome (string).
const iconMap = {
  Activity,
  Award,
  Bell,
  BookOpen,
  Calendar,
  ClipboardCheck,
  ClipboardList,
  DollarSign,
  FileBarChart,
  FileSignature,
  FileText,
  FolderOpen,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Layers,
  LifeBuoy,
  Mail,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Package,
  Palette,
  Plug,
  Repeat,
  RotateCcw,
  ScrollText,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  TrendingUp,
  User,
  Users,
  Users2,
  UsersRound,
} as const;

export type IconName = keyof typeof iconMap;

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: IconName;
}

interface SidebarProps {
  roleLabel: string;
  navItems: SidebarNavItem[];
}

function SidebarContent({
  roleLabel,
  navItems,
  onNavigate,
}: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center gap-2 bg-brand-navy px-5 py-5 text-white">
        <ShieldCheck className="size-6 text-brand-teal" aria-hidden />
        <div>
          <p className="text-sm font-bold leading-tight">Frontline Medical</p>
          <p className="text-xs text-white/60">{roleLabel}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = iconMap[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted",
                active && "bg-brand-teal/10 text-brand-navy"
              )}
            >
              <span
                className={cn(
                  "h-5 w-1 shrink-0 rounded-full",
                  active ? "bg-brand-teal" : "bg-transparent"
                )}
                aria-hidden
              />
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-border md:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent {...props} />
        </div>
      </aside>

      <div className="fixed left-4 top-4 z-40 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                aria-label="Abrir menu de navegação"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="gap-0 p-0">
            <SidebarContent {...props} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
