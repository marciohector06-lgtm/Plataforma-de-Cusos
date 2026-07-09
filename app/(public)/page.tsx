import Link from "next/link";
import { Award, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const diferenciais = [
  {
    icon: Stethoscope,
    titulo: "Instrutores certificados",
    descricao:
      "Profissionais da saúde com experiência real em atendimento de emergência.",
  },
  {
    icon: Award,
    titulo: "Certificação reconhecida",
    descricao:
      "Certificado digital validado para cada aluno que concluir o curso.",
  },
  {
    icon: HeartPulse,
    titulo: "Conteúdo prático",
    descricao:
      "Treinamentos com foco em cenários reais de suporte de vida e emergências.",
  },
];

export default async function HomePage() {
  const cursosDestaque = await db.curso.findMany({
    where: { status: "PUBLICADO" },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div>
      <section className="bg-brand-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6">
          <Badge variant="outline" className="border-white/30 text-white">
            <ShieldCheck className="size-3" aria-hidden />
            Educação em saúde e emergências
          </Badge>
          <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Treinamento que salva vidas.
          </h1>
          <p className="max-w-xl text-lg text-white/80">
            Cursos e certificações em suporte de vida, emergências médicas e
            saúde ocupacional, para profissionais e equipes que precisam estar
            prontos quando mais importa.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/cursos" />}>
              Ver cursos
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              render={<Link href="/cadastro" />}
            >
              Comece agora
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {diferenciais.map((item) => (
            <Card key={item.titulo}>
              <CardContent className="space-y-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                  <item.icon className="size-5" aria-hidden />
                </div>
                <p className="font-heading font-bold text-brand-navy">
                  {item.titulo}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.descricao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {cursosDestaque.length > 0 && (
        <section className="bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-brand-navy">
                Cursos em destaque
              </h2>
              <Button variant="outline" render={<Link href="/cursos" />}>
                Ver todos
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cursosDestaque.map((curso) => (
                <Card key={curso.id}>
                  <CardHeader>
                    <CardTitle>{curso.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {curso.descricao}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{curso.cargaHoraria}h</Badge>
                      <Link
                        href={`/cursos/${curso.slug}`}
                        className="text-sm font-medium text-brand-teal-600 hover:underline"
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
