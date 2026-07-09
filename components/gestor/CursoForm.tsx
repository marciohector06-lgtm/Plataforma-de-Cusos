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
import { criarCursoAction, editarCursoAction } from "@/lib/actions/gestor-cursos";
import { cursoSchema, type CursoInput } from "@/lib/validators";
import { cursoStatusLabels } from "@/lib/utils";
import type { Curso } from "@/lib/generated/prisma/client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface CursoFormProps {
  curso?: Curso;
  instrutores: { id: string; name: string }[];
  onSuccess: () => void;
}

export function CursoForm({ curso, instrutores, onSuccess }: CursoFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!curso;

  const form = useForm({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      titulo: curso?.titulo ?? "",
      slug: curso?.slug ?? "",
      descricao: curso?.descricao ?? "",
      cargaHoraria: curso?.cargaHoraria ?? 0,
      autorId: curso?.autorId ?? "",
      status: curso?.status ?? "RASCUNHO",
    },
  });

  function onSubmit(values: CursoInput) {
    startTransition(async () => {
      const result = isEdit
        ? await editarCursoAction(curso!.id, values)
        : await criarCursoAction(values);

      if (result.success) {
        toast.success(isEdit ? "Curso atualizado" : "Curso criado");
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
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!isEdit) {
                      form.setValue("slug", slugify(e.target.value));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cargaHoraria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carga horária (h)</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} value={field.value as number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="autorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instrutor responsável</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o instrutor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {instrutores.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name}
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(cursoStatusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar curso"}
        </Button>
      </form>
    </Form>
  );
}
