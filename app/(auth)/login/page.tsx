import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse sua conta para continuar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
        <div className="flex justify-between text-sm text-muted-foreground">
          <Link href="/cadastro" className="hover:text-brand-teal-600">
            Criar conta
          </Link>
          <Link href="/recuperar-senha" className="hover:text-brand-teal-600">
            Esqueci minha senha
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
