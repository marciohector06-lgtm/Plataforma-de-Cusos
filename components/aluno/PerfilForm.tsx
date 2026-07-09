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
import { updatePerfilAction } from "@/lib/actions/perfil";
import { updatePerfilSchema, type UpdatePerfilInput } from "@/lib/validators";

interface PerfilFormProps {
  defaultValues: UpdatePerfilInput;
  email: string;
  role: string;
}

export function PerfilForm({ defaultValues, email, role }: PerfilFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<UpdatePerfilInput>({
    resolver: zodResolver(updatePerfilSchema),
    defaultValues,
  });

  function onSubmit(values: UpdatePerfilInput) {
    startTransition(async () => {
      const result = await updatePerfilAction(values);
      if (result.success) {
        toast.success("Perfil atualizado com sucesso");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg space-y-5">
        <div className="grid gap-1.5">
          <p className="text-sm text-muted-foreground">E-mail</p>
          <p className="text-sm font-medium text-brand-navy">{email}</p>
        </div>
        <div className="grid gap-1.5">
          <p className="text-sm text-muted-foreground">Papel</p>
          <p className="text-sm font-medium text-brand-navy">{role}</p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da foto de perfil</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
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
