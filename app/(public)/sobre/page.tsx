import { Award, HeartPulse, Target, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const valores = [
  {
    icon: HeartPulse,
    titulo: "Cuidado com a vida",
    descricao:
      "Cada curso é pensado para preparar pessoas reais para agir em momentos críticos.",
  },
  {
    icon: Target,
    titulo: "Excelência técnica",
    descricao:
      "Conteúdo alinhado às melhores práticas e protocolos de saúde e emergência.",
  },
  {
    icon: Users,
    titulo: "Acessibilidade",
    descricao:
      "Formatos presenciais e a distância para alcançar profissionais em todo o país.",
  },
  {
    icon: Award,
    titulo: "Reconhecimento",
    descricao:
      "Certificações que têm valor real na carreira dos nossos alunos.",
  },
];

export default function SobrePage() {
  return (
    <div>
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            Sobre a Frontline Medical
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Somos uma plataforma de educação em saúde dedicada a formar
            profissionais e equipes preparados para responder a emergências
            médicas com segurança e confiança.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold text-brand-navy">
              Nossa missão
            </h2>
            <p className="text-muted-foreground">
              Levar treinamento de suporte de vida e atendimento de emergência
              a quem mais precisa: profissionais de saúde, equipes
              corporativas e qualquer pessoa que queira estar preparada para
              agir nos primeiros minutos que podem salvar uma vida.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold text-brand-navy">
              Como trabalhamos
            </h2>
            <p className="text-muted-foreground">
              Nossos cursos são desenvolvidos e ministrados por instrutores
              com experiência prática em atendimento de emergência,
              combinando teoria, simulação e avaliação contínua para garantir
              que o conhecimento realmente fique.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 font-heading text-2xl font-bold text-brand-navy">
            Nossos valores
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valores.map((valor) => (
              <Card key={valor.titulo}>
                <CardContent className="space-y-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                    <valor.icon className="size-5" aria-hidden />
                  </div>
                  <p className="font-heading font-bold text-brand-navy">
                    {valor.titulo}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {valor.descricao}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
