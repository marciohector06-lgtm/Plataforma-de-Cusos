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
import { criarTurmaAction, editarTurmaAction } from "@/lib/actions/gestor-cursos";
import { turmaSchema, type TurmaInput } from "@/lib/validators";
import { turmaStatusLabels } from "@/lib/utils";
import type { Turma } from "@/lib/generated/prisma/client";

function toDateInput(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

interface TurmaFormProps {
  turma?: Turma;
  cursos: { id: string; titulo: string }[];
  instrutores: { id: string; name: string }[];
  onSuccess: () => void;
}

export function TurmaForm({ turma, cursos, instrutores, onSuccess }: TurmaFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!turma;

  const form = useForm({
    resolver: zodResolver(turmaSchema),
    defaultValues: {
      cursoId: turma?.cursoId ?? "",
      instrutorId: turma?.instrutorId ?? "",
      nome: turma?.nome ?? "",
      dataInicio: turma ? toDateInput(turma.dataInicio) : "",
      dataFim: turma ? toDateInput(turma.dataFim) : "",
      vagas: turma?.vagas ?? 1,
      status: turma?.status ?? "PLANEJADA",
    },
  });

  function onSubmit(values: TurmaInput) {
    startTransition(async () => {
      const result = isEdit
        ? await editarTurmaAction(turma!.id, values)
        : await criarTurmaAction(values);

      if (result.success) {
        toast.success(isEdit ? "Turma atualizada" : "Turma criada");
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
          name="cursoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cursos.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.titulo}
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
          name="instrutorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instrutor</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o instrutor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {instrutores.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name}
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
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da turma</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="dataInicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Início</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataFim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fim</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="vagas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vagas</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} value={field.value as number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(turmaStatusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar turma"}
        </Button>
      </form>
    </Form>
  );
}
