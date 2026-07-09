import Link from "next/link";
import { Building2, GraduationCap, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const formatos = [
  {
    icon: GraduationCap,
    titulo: "Presencial",
    descricao:
      "Aulas práticas com simulação realista, em parceria com instituições de saúde e centros de treinamento.",
  },
  {
    icon: Laptop,
    titulo: "A distância",
    descricao:
      "Conteúdo teórico em vídeo e material de apoio, com acompanhamento de progresso pela plataforma.",
  },
  {
    icon: Building2,
    titulo: "In-company",
    descricao:
      "Treinamentos personalizados para equipes e empresas, no local de trabalho ou em turmas fechadas.",
  },
];

export default function TreinamentosPage() {
  return (
    <div>
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            Treinamentos
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Escolha o formato que melhor se encaixa na sua rotina ou na
            realidade da sua equipe. Todos os treinamentos seguem os mesmos
            padrões de qualidade e certificação.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {formatos.map((formato) => (
            <Card key={formato.titulo}>
              <CardContent className="space-y-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                  <formato.icon className="size-5" aria-hidden />
                </div>
                <p className="font-heading font-bold text-brand-navy">
                  {formato.titulo}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formato.descricao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-heading text-xl font-bold text-brand-navy">
            Quer saber qual formato é ideal para você ou sua equipe?
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Fale com a gente e te ajudamos a escolher o treinamento certo.
          </p>
          <Button render={<Link href="/contato" />}>Fale conosco</Button>
        </div>
      </section>
    </div>
  );
}
