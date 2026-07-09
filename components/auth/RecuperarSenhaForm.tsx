"use client";

import { useState, useTransition } from "react";
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
import { recuperarSenhaAction } from "@/lib/actions/auth";
import {
  recuperarSenhaSchema,
  type RecuperarSenhaInput,
} from "@/lib/validators";

export function RecuperarSenhaForm() {
  const [enviado, setEnviado] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<RecuperarSenhaInput>({
    resolver: zodResolver(recuperarSenhaSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: RecuperarSenhaInput) {
    startTransition(async () => {
      const result = await recuperarSenhaAction(values);
      if (result.success) {
        setEnviado(true);
      } else {
        toast.error(result.error);
      }
    });
  }

  if (enviado) {
    return (
      <p className="text-sm text-muted-foreground">
        Se houver uma conta com este e-mail, você receberá instruções para
        redefinir sua senha em instantes.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Enviando..." : "Enviar instruções"}
        </Button>
      </form>
    </Form>
  );
}
