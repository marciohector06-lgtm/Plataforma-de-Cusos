import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CadastroForm } from "@/components/auth/CadastroForm";

export default function CadastroPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>Comece sua trilha de treinamento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CadastroForm />
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-brand-teal-600 hover:underline">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
