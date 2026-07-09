"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { enviarMensagemAction } from "@/lib/actions/instrutor-mensagens";
import { mensagemSchema, type MensagemInput } from "@/lib/validators";

interface MensagemFormProps {
  alunos: { id: string; name: string }[];
  onSuccess: () => void;
}

export function MensagemForm({ alunos, onSuccess }: MensagemFormProps) {
  const [pending, startTransition] = useTransition();

  const form = useForm<MensagemInput>({
    resolver: zodResolver(mensagemSchema),
    defaultValues: { destinatarioId: "", corpo: "" },
  });

  function onSubmit(values: MensagemInput) {
    startTransition(async () => {
      const result = await enviarMensagemAction(values);
      if (result.success) {
        toast.success("Mensagem enviada");
        form.reset();
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
          name="destinatarioId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o aluno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {alunos.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
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
          name="corpo"
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
        <Button type="submit" disabled={pending}>
          {pending ? "Enviando..." : "Enviar mensagem"}
        </Button>
      </form>
    </Form>
  );
}
