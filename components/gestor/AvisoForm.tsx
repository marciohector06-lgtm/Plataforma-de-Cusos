"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { enviarAvisoAction } from "@/lib/actions/gestor";
import { avisoSchema, type AvisoInput } from "@/lib/validators";

export function AvisoForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<AvisoInput>({
    resolver: zodResolver(avisoSchema),
    defaultValues: { titulo: "", mensagem: "", publico: "TODOS" },
  });

  function onSubmit(values: AvisoInput) {
    startTransition(async () => {
      const result = await enviarAvisoAction(values);
      if (result.success) {
        toast.success(`Aviso enviado para ${result.total} usuário(s)`);
        form.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg space-y-5">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mensagem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Público</FormLabel>
              <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o público" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os usuários</SelectItem>
                  <SelectItem value="ALUNO">Alunos</SelectItem>
                  <SelectItem value="INSTRUTOR">Instrutores</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          {pending ? "Enviando..." : "Enviar aviso"}
        </Button>
      </form>
    </Form>
  );
}
