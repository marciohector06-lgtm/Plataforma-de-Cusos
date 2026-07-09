"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/sobre", label: "Sobre" },
  { href: "/cursos", label: "Cursos" },
  { href: "/treinamentos", label: "Treinamentos" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-brand-navy text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="size-6 text-brand-teal" aria-hidden />
          <span className="font-heading text-sm font-bold leading-tight sm:text-base">
            Frontline Medical
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 hover:text-white"
            render={<Link href="/login" />}
          >
            Entrar
          </Button>
          <Button render={<Link href="/cadastro" />}>Cadastre-se</Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-white md:hidden"
                aria-label="Abrir menu de navegação"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-6 p-6">
            <nav className="flex flex-col gap-4 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-brand-navy"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2">
              <Button variant="outline" render={<Link href="/login" />}>
                Entrar
              </Button>
              <Button render={<Link href="/cadastro" />}>Cadastre-se</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
