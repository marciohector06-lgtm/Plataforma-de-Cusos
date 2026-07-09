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
import { salvarPersonalizacaoAction } from "@/lib/actions/gestor-config";
import { personalizacaoSchema, type PersonalizacaoInput } from "@/lib/validators";

interface PersonalizacaoFormProps {
  personalizacao: {
    nomeExibicao: string;
    logoUrl: string | null;
    corPrimaria: string;
    corSecundaria: string;
  } | null;
}

export function PersonalizacaoForm({ personalizacao }: PersonalizacaoFormProps) {
  const [pending, startTransition] = useTransition();

  const form = useForm<PersonalizacaoInput>({
    resolver: zodResolver(personalizacaoSchema),
    defaultValues: {
      nomeExibicao: personalizacao?.nomeExibicao ?? "Frontline Medical",
      logoUrl: personalizacao?.logoUrl ?? "",
      corPrimaria: personalizacao?.corPrimaria ?? "#0C2233",
      corSecundaria: personalizacao?.corSecundaria ?? "#14B8A6",
    },
  });

  function onSubmit(values: PersonalizacaoInput) {
    startTransition(async () => {
      const result = await salvarPersonalizacaoAction(values);
      if (result.success) {
        toast.success("Personalização salva");
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
          name="nomeExibicao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de exibição</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do logo (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="corPrimaria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor primária</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={field.value}
                      onChange={field.onChange}
                      className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-border"
                    />
                    <Input {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="corSecundaria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor secundária</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={field.value}
                      onChange={field.onChange}
                      className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-border"
                    />
                    <Input {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Essas configurações serão aplicadas em uma fase futura de theming dinâmico.
          Por enquanto, apenas os valores são salvos.
        </p>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Form>
  );
}
