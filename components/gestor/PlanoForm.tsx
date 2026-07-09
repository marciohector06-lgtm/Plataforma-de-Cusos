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
import { criarPlanoAction, editarPlanoAction } from "@/lib/actions/gestor-financeiro";
import { planoSchema, type PlanoInput } from "@/lib/validators";
import { planoRecorrenciaLabels } from "@/lib/utils";
import type { Plano } from "@/lib/generated/prisma/client";

interface PlanoFormProps {
  plano?: Plano;
  onSuccess: () => void;
}

export function PlanoForm({ plano, onSuccess }: PlanoFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!plano;

  const form = useForm({
    resolver: zodResolver(planoSchema),
    defaultValues: {
      nome: plano?.nome ?? "",
      descricao: plano?.descricao ?? "",
      precoReais: plano ? plano.precoCentavos / 100 : 0,
      recorrencia: plano?.recorrencia ?? "MENSAL",
      ativo: plano?.ativo ?? true,
    },
  });

  function onSubmit(values: PlanoInput) {
    startTransition(async () => {
      const result = isEdit
        ? await editarPlanoAction(plano!.id, values)
        : await criarPlanoAction(values);

      if (result.success) {
        toast.success(isEdit ? "Plano atualizado" : "Plano criado");
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
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
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
          name="precoReais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <Input type="number" min={0} step="0.01" {...field} value={field.value as number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recorrencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recorrência</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(planoRecorrenciaLabels).map(([value, label]) => (
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
        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem>
              <label className="flex w-fit items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 rounded border-input accent-brand-teal"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                Plano ativo
              </label>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar plano"}
        </Button>
      </form>
    </Form>
  );
}
