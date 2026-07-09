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
import {
  criarInstrutorAction,
  editarInstrutorAction,
} from "@/lib/actions/gestor-usuarios";
import {
  criarInstrutorSchema,
  editarInstrutorSchema,
  type CriarInstrutorInput,
  type EditarInstrutorInput,
} from "@/lib/validators";

interface InstrutorFormProps {
  instrutor?: { id: string; name: string };
  onSuccess: () => void;
}

export function InstrutorForm({ instrutor, onSuccess }: InstrutorFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!instrutor;

  const createForm = useForm<CriarInstrutorInput>({
    resolver: zodResolver(criarInstrutorSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const editForm = useForm<EditarInstrutorInput>({
    resolver: zodResolver(editarInstrutorSchema),
    defaultValues: { name: instrutor?.name ?? "", password: "" },
  });

  function onSubmitEdit(values: EditarInstrutorInput) {
    startTransition(async () => {
      const result = await editarInstrutorAction(instrutor!.id, values);
      if (result.success) {
        toast.success("Instrutor atualizado");
        onSuccess();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onSubmitCreate(values: CriarInstrutorInput) {
    startTransition(async () => {
      const result = await criarInstrutorAction(values);
      if (result.success) {
        toast.success("Instrutor cadastrado");
        createForm.reset();
        onSuccess();
      } else {
        toast.error(result.error);
      }
    });
  }

  if (isEdit) {
    return (
      <Form {...editForm}>
        <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
          <FormField
            control={editForm.control}
            name="name"
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
            control={editForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova senha (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Deixe em branco para manter a atual"
                    {...field}
                  />
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

  return (
    <Form {...createForm}>
      <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-4">
        <FormField
          control={createForm.control}
          name="name"
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
          control={createForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={createForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Cadastrando..." : "Cadastrar instrutor"}
        </Button>
      </form>
    </Form>
  );
}
