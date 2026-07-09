"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  criarMembroEquipeAction,
  editarMembroEquipeAction,
} from "@/lib/actions/gestor-usuarios";
import {
  criarMembroEquipeSchema,
  editarMembroEquipeSchema,
  type CriarMembroEquipeInput,
  type EditarMembroEquipeInput,
} from "@/lib/validators";
import type { Role } from "@/lib/generated/prisma/client";

interface EquipeFormProps {
  membro?: { id: string; name: string; role: Role };
  onSuccess: () => void;
}

export function EquipeForm({ membro, onSuccess }: EquipeFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!membro;

  const createForm = useForm<CriarMembroEquipeInput>({
    resolver: zodResolver(criarMembroEquipeSchema),
    defaultValues: { name: "", email: "", password: "", role: "GESTOR" },
  });

  const editForm = useForm<EditarMembroEquipeInput>({
    resolver: zodResolver(editarMembroEquipeSchema),
    defaultValues: {
      name: membro?.name ?? "",
      role: membro?.role === "ADMIN" ? "ADMIN" : "GESTOR",
      password: "",
    },
  });

  function onSubmitEdit(values: EditarMembroEquipeInput) {
    startTransition(async () => {
      const result = await editarMembroEquipeAction(membro!.id, values);
      if (result.success) {
        toast.success("Membro atualizado");
        onSuccess();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onSubmitCreate(values: CriarMembroEquipeInput) {
    startTransition(async () => {
      const result = await criarMembroEquipeAction(values);
      if (result.success) {
        toast.success("Membro cadastrado");
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
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Papel</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GESTOR">Gestor</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
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
        <FormField
          control={createForm.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Papel</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GESTOR">Gestor</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Cadastrando..." : "Cadastrar membro"}
        </Button>
      </form>
    </Form>
  );
}
