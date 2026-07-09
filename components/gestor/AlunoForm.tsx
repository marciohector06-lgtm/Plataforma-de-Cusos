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
import { criarAlunoAction, editarAlunoAction } from "@/lib/actions/gestor-usuarios";
import {
  criarAlunoSchema,
  editarAlunoSchema,
  type CriarAlunoInput,
  type EditarAlunoInput,
} from "@/lib/validators";

interface AlunoFormProps {
  aluno?: { id: string; name: string };
  onSuccess: () => void;
}

export function AlunoForm({ aluno, onSuccess }: AlunoFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!aluno;

  const createForm = useForm<CriarAlunoInput>({
    resolver: zodResolver(criarAlunoSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const editForm = useForm<EditarAlunoInput>({
    resolver: zodResolver(editarAlunoSchema),
    defaultValues: { name: aluno?.name ?? "", password: "" },
  });

  function onSubmitEdit(values: EditarAlunoInput) {
    startTransition(async () => {
      const result = await editarAlunoAction(aluno!.id, values);
      if (result.success) {
        toast.success("Aluno atualizado");
        onSuccess();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onSubmitCreate(values: CriarAlunoInput) {
    startTransition(async () => {
      const result = await criarAlunoAction(values);
      if (result.success) {
        toast.success("Aluno cadastrado");
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
          {pending ? "Cadastrando..." : "Cadastrar aluno"}
        </Button>
      </form>
    </Form>
  );
}
