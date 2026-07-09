"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { createTicketSuporteAction } from "@/lib/actions/suporte";
import { ticketSuporteSchema, type TicketSuporteInput } from "@/lib/validators";

export function SuporteForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<TicketSuporteInput>({
    resolver: zodResolver(ticketSuporteSchema),
    defaultValues: { assunto: "", mensagem: "" },
  });

  function onSubmit(values: TicketSuporteInput) {
    startTransition(async () => {
      const result = await createTicketSuporteAction(values);
      if (result.success) {
        toast.success("Chamado aberto com sucesso");
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
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          {pending ? "Enviando..." : "Abrir chamado"}
        </Button>
      </form>
    </Form>
  );
}
