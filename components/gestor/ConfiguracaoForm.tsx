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
import { salvarConfiguracaoAction } from "@/lib/actions/gestor-config";
import {
  configuracaoPlataformaSchema,
  type ConfiguracaoPlataformaInput,
} from "@/lib/validators";

interface ConfiguracaoFormProps {
  configuracao: {
    nomeInstituicao: string;
    emailContato: string;
    telefoneContato: string | null;
    endereco: string | null;
  } | null;
}

export function ConfiguracaoForm({ configuracao }: ConfiguracaoFormProps) {
  const [pending, startTransition] = useTransition();

  const form = useForm<ConfiguracaoPlataformaInput>({
    resolver: zodResolver(configuracaoPlataformaSchema),
    defaultValues: {
      nomeInstituicao: configuracao?.nomeInstituicao ?? "",
      emailContato: configuracao?.emailContato ?? "",
      telefoneContato: configuracao?.telefoneContato ?? "",
      endereco: configuracao?.endereco ?? "",
    },
  });

  function onSubmit(values: ConfiguracaoPlataformaInput) {
    startTransition(async () => {
      const result = await salvarConfiguracaoAction(values);
      if (result.success) {
        toast.success("Configurações salvas");
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
          name="nomeInstituicao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da instituição</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailContato"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail de contato</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefoneContato"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone de contato</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input {...field} />
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
