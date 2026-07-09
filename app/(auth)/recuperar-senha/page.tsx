import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecuperarSenhaForm } from "@/components/auth/RecuperarSenhaForm";

export default function RecuperarSenhaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
        <CardDescription>
          Informe seu e-mail para receber as instruções
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RecuperarSenhaForm />
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-brand-teal-600 hover:underline">
            Voltar para o login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
