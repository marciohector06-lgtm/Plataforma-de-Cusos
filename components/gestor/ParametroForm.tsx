"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { salvarParametroAction } from "@/lib/actions/gestor-config";
import { parametroSistemaSchema, type ParametroSistemaInput } from "@/lib/validators";

interface ParametroFormProps {
  parametro: {
    notaMinimaPadrao: number;
    diasValidadeCertificado: number;
    vagasPadraoTurma: number;
  } | null;
}

export function ParametroForm({ parametro }: ParametroFormProps) {
  const [pending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(parametroSistemaSchema),
    defaultValues: {
      notaMinimaPadrao: parametro?.notaMinimaPadrao ?? 60,
      diasValidadeCertificado: parametro?.diasValidadeCertificado ?? 0,
      vagasPadraoTurma: parametro?.vagasPadraoTurma ?? 30,
    },
  });

  function onSubmit(values: ParametroSistemaInput) {
    startTransition(async () => {
      const result = await salvarParametroAction(values);
      if (result.success) {
        toast.success("Parâmetros salvos");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg space-y-4">
        <FormField
          control={form.control}
          name="notaMinimaPadrao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nota mínima padrão para aprovação</FormLabel>
              <FormControl>
                <Input type="number" min={0} max={100} {...field} value={field.value as number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="diasValidadeCertificado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dias de validade do certificado (0 = sem validade)</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} value={field.value as number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vagasPadraoTurma"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vagas padrão ao criar uma turma</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} value={field.value as number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Form>
  );
}
