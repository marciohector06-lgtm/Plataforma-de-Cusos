import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const colunas = [
  {
    titulo: "Institucional",
    links: [
      { href: "/sobre", label: "Sobre nós" },
      { href: "/treinamentos", label: "Treinamentos" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    titulo: "Cursos",
    links: [
      { href: "/cursos", label: "Todos os cursos" },
      { href: "/cadastro", label: "Criar conta" },
      { href: "/login", label: "Área do aluno" },
    ],
  },
  {
    titulo: "Contato",
    links: [
      { href: "/contato", label: "Fale conosco" },
      { href: "mailto:contato@frontlinemedical.com.br", label: "contato@frontlinemedical.com.br" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-brand-navy-700 text-white/70">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="size-5 text-brand-teal" aria-hidden />
              <span className="font-heading text-sm font-bold">
                Frontline Medical
              </span>
            </div>
            <p className="text-sm">
              Educação e certificação em saúde, suporte de vida e emergências
              médicas.
            </p>
          </div>

          {colunas.map((coluna) => (
            <div key={coluna.titulo} className="space-y-2">
              <p className="text-sm font-semibold text-white">{coluna.titulo}</p>
              <ul className="space-y-1.5 text-sm">
                {coluna.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-white/50">
          © {new Date().getFullYear()} Frontline Medical. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
