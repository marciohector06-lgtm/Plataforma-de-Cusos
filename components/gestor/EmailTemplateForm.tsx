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
import {
  criarEmailTemplateAction,
  editarEmailTemplateAction,
} from "@/lib/actions/gestor-templates";
import { emailTemplateSchema, type EmailTemplateInput } from "@/lib/validators";
import type { EmailTemplate } from "@/lib/generated/prisma/client";

interface EmailTemplateFormProps {
  template?: EmailTemplate;
  onSuccess: () => void;
}

export function EmailTemplateForm({ template, onSuccess }: EmailTemplateFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!template;

  const form = useForm<EmailTemplateInput>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      nome: template?.nome ?? "",
      assunto: template?.assunto ?? "",
      corpo: template?.corpo ?? "",
      ativo: template?.ativo ?? true,
    },
  });

  function onSubmit(values: EmailTemplateInput) {
    startTransition(async () => {
      const result = isEdit
        ? await editarEmailTemplateAction(template!.id, values)
        : await criarEmailTemplateAction(values);

      if (result.success) {
        toast.success(isEdit ? "Modelo atualizado" : "Modelo criado");
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
              <FormLabel>Nome do modelo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Confirmação de matrícula" {...field} />
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
          name="corpo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Corpo do e-mail</FormLabel>
              <FormControl>
                <Textarea rows={6} {...field} />
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
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar modelo"}
        </Button>
      </form>
    </Form>
  );
}
