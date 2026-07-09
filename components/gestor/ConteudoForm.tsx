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
import { criarConteudoAction, editarConteudoAction } from "@/lib/actions/gestor-cursos";
import { conteudoSchema, type ConteudoInput } from "@/lib/validators";
import { conteudoTipoLabels } from "@/lib/utils";
import type { Conteudo, ConteudoTipo } from "@/lib/generated/prisma/client";

interface ConteudoFormProps {
  conteudo?: Conteudo;
  cursos: { id: string; titulo: string }[];
  tiposPermitidos?: ConteudoTipo[];
  onSuccess: () => void;
}

export function ConteudoForm({
  conteudo,
  cursos,
  tiposPermitidos = ["VIDEO", "PDF", "TEXTO", "LINK"],
  onSuccess,
}: ConteudoFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!conteudo;

  const form = useForm({
    resolver: zodResolver(conteudoSchema),
    defaultValues: {
      cursoId: conteudo?.cursoId ?? "",
      titulo: conteudo?.titulo ?? "",
      tipo: conteudo?.tipo ?? tiposPermitidos[0],
      url: conteudo?.url ?? "",
      corpo: conteudo?.corpo ?? "",
      ordem: conteudo?.ordem ?? 1,
    },
  });

  const tipo = form.watch("tipo");

  function onSubmit(values: ConteudoInput) {
    startTransition(async () => {
      const result = isEdit
        ? await editarConteudoAction(conteudo!.id, values)
        : await criarConteudoAction(values);

      if (result.success) {
        toast.success(isEdit ? "Conteúdo atualizado" : "Conteúdo criado");
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
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tiposPermitidos.map((t) => (
                    <SelectItem key={t} value={t}>
                      {conteudoTipoLabels[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {tipo === "TEXTO" ? (
          <FormField
            control={form.control}
            name="corpo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL / link</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="ordem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordem</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} value={field.value as number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Adicionar conteúdo"}
        </Button>
      </form>
    </Form>
  );
}
