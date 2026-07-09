import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContatoForm } from "@/components/public/ContatoForm";

const contatos = [
  { icon: Mail, label: "contato@frontlinemedical.com.br" },
  { icon: Phone, label: "(11) 4000-0000" },
  { icon: MapPin, label: "São Paulo, SP" },
];

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-brand-navy sm:text-4xl">
          Fale conosco
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Tem dúvidas sobre nossos cursos ou treinamentos in-company? Envie
          uma mensagem para nossa equipe.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          {contatos.map((contato) => (
            <div key={contato.label} className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                <contato.icon className="size-4" aria-hidden />
              </div>
              <p className="text-sm text-muted-foreground">{contato.label}</p>
            </div>
          ))}
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Envie sua mensagem</CardTitle>
          </CardHeader>
          <CardContent>
            <ContatoForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
