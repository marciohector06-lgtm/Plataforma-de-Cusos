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
  criarIntegracaoAction,
  editarIntegracaoAction,
} from "@/lib/actions/gestor-config";
import { integracaoSchema, type IntegracaoInput } from "@/lib/validators";
import { tipoIntegracaoLabels } from "@/lib/utils";
import type { Integracao } from "@/lib/generated/prisma/client";

interface IntegracaoFormProps {
  integracao?: Integracao;
  onSuccess: () => void;
}

export function IntegracaoForm({ integracao, onSuccess }: IntegracaoFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!integracao;

  const form = useForm<IntegracaoInput>({
    resolver: zodResolver(integracaoSchema),
    defaultValues: {
      nome: integracao?.nome ?? "",
      tipo: integracao?.tipo ?? "API_KEY",
      valor: integracao?.valor ?? "",
      ativo: integracao?.ativo ?? true,
    },
  });

  function onSubmit(values: IntegracaoInput) {
    startTransition(async () => {
      const result = isEdit
        ? await editarIntegracaoAction(integracao!.id, values)
        : await criarIntegracaoAction(values);

      if (result.success) {
        toast.success(isEdit ? "Integração atualizada" : "Integração criada");
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
                <Input placeholder="Ex: Google Analytics" {...field} />
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
                  {Object.entries(tipoIntegracaoLabels).map(([value, label]) => (
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
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave / valor</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                value={field.value ? "true" : "false"}
                onValueChange={(v) => field.onChange(v === "true")}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Ativa</SelectItem>
                  <SelectItem value="false">Inativa</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar integração"}
        </Button>
      </form>
    </Form>
  );
}
