"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { enviarMensagemContatoAction } from "@/lib/actions/contato";
import { contatoSchema, type ContatoInput } from "@/lib/validators";

export function ContatoForm() {
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const form = useForm<ContatoInput>({
    resolver: zodResolver(contatoSchema),
    defaultValues: { nome: "", email: "", assunto: "", mensagem: "" },
  });

  function onSubmit(values: ContatoInput) {
    setErro(null);
    startTransition(async () => {
      const result = await enviarMensagemContatoAction(values);
      if (result.success) {
        setEnviado(true);
        form.reset();
      } else {
        setErro(result.error);
      }
    });
  }

  if (enviado) {
    return (
      <p className="text-sm text-muted-foreground">
        Mensagem enviada com sucesso. Nossa equipe entrará em contato em
        breve.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="voce@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assunto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assunto</FormLabel>
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
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Enviando..." : "Enviar mensagem"}
        </Button>
      </form>
    </Form>
  );
}
