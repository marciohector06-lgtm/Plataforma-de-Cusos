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
  criarMatriculaAction,
  editarMatriculaAction,
} from "@/lib/actions/gestor-matriculas";
import {
  criarMatriculaSchema,
  editarMatriculaSchema,
  type CriarMatriculaInput,
  type EditarMatriculaInput,
} from "@/lib/validators";
import { matriculaStatusLabels } from "@/lib/utils";
import type { Matricula } from "@/lib/generated/prisma/client";

interface MatriculaFormProps {
  matricula?: Matricula;
  alunos: { id: string; name: string }[];
  turmas: { id: string; nome: string; curso: { titulo: string } }[];
  onSuccess: () => void;
}

export function MatriculaForm({
  matricula,
  alunos,
  turmas,
  onSuccess,
}: MatriculaFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!matricula;

  const createForm = useForm<CriarMatriculaInput>({
    resolver: zodResolver(criarMatriculaSchema),
    defaultValues: { alunoId: "", turmaId: "", status: "ATIVA" },
  });

  const editForm = useForm({
    resolver: zodResolver(editarMatriculaSchema),
    defaultValues: {
      status: matricula?.status ?? "ATIVA",
      progresso: matricula?.progresso ?? 0,
    },
  });

  function onSubmitCreate(values: CriarMatriculaInput) {
    startTransition(async () => {
      const result = await criarMatriculaAction(values);
      if (result.success) {
        toast.success("Matrícula criada");
        createForm.reset();
        onSuccess();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onSubmitEdit(values: EditarMatriculaInput) {
    startTransition(async () => {
      const result = await editarMatriculaAction(matricula!.id, values);
      if (result.success) {
        toast.success("Matrícula atualizada");
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
                    {Object.entries(matriculaStatusLabels).map(([value, label]) => (
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
          <FormField
            control={editForm.control}
            name="progresso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Progresso (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    {...field}
                    value={field.value as number}
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
          name="alunoId"
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
          control={createForm.control}
          name="turmaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turma</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {turmas.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.curso.titulo} — {t.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={createForm.control}
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
                  {Object.entries(matriculaStatusLabels).map(([value, label]) => (
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
          {pending ? "Matriculando..." : "Criar matrícula"}
        </Button>
      </form>
    </Form>
  );
}
