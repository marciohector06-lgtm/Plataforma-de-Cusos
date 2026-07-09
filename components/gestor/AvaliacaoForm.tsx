"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  criarAvaliacaoAction,
  editarAvaliacaoAction,
} from "@/lib/actions/gestor-avaliacoes";
import { avaliacaoSchema, type AvaliacaoInput } from "@/lib/validators";
import type { Avaliacao } from "@/lib/generated/prisma/client";

interface AvaliacaoFormProps {
  avaliacao?: Avaliacao;
  cursos: { id: string; titulo: string }[];
  onSuccess: () => void;
}

export function AvaliacaoForm({ avaliacao, cursos, onSuccess }: AvaliacaoFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!avaliacao;

  const form = useForm({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      cursoId: avaliacao?.cursoId ?? "",
      titulo: avaliacao?.titulo ?? "",
      notaMinima: avaliacao?.notaMinima ?? 60,
    },
  });

  function onSubmit(values: AvaliacaoInput) {
    startTransition(async () => {
      const result = isEdit
        ? await editarAvaliacaoAction(avaliacao!.id, values)
        : await criarAvaliacaoAction(values);

      if (result.success) {
        toast.success(isEdit ? "Avaliação atualizada" : "Avaliação criada");
        if (!isEdit) form.reset();
        onSuccess();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="cursoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cursos.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="notaMinima"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nota mínima para aprovação</FormLabel>
              <FormControl>
                <Input type="number" min={0} max={100} {...field} value={field.value as number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar avaliação"}
        </Button>
      </form>
    </Form>
  );
}
