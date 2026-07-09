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
  criarWhatsappTemplateAction,
  editarWhatsappTemplateAction,
} from "@/lib/actions/gestor-templates";
import { whatsappTemplateSchema, type WhatsappTemplateInput } from "@/lib/validators";
import type { WhatsappTemplate } from "@/lib/generated/prisma/client";

interface WhatsappTemplateFormProps {
  template?: WhatsappTemplate;
  onSuccess: () => void;
}

export function WhatsappTemplateForm({ template, onSuccess }: WhatsappTemplateFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!template;

  const form = useForm<WhatsappTemplateInput>({
    resolver: zodResolver(whatsappTemplateSchema),
    defaultValues: {
      nome: template?.nome ?? "",
      corpo: template?.corpo ?? "",
      ativo: template?.ativo ?? true,
    },
  });

  function onSubmit(values: WhatsappTemplateInput) {
    startTransition(async () => {
      const result = isEdit
        ? await editarWhatsappTemplateAction(template!.id, values)
        : await criarWhatsappTemplateAction(values);

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
                <Input placeholder="Ex: Boas-vindas" {...field} />
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
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
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
