"use client";

import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
import { criarQuestaoAction, editarQuestaoAction } from "@/lib/actions/gestor-avaliacoes";
import { questaoSchema, type QuestaoInput } from "@/lib/validators";
import type { Prisma } from "@/lib/generated/prisma/client";

type Questao = Prisma.QuestaoGetPayload<{ include: { alternativas: true } }>;

interface QuestaoFormProps {
  questao?: Questao;
  avaliacoes: { id: string; titulo: string; cursoTitulo: string }[];
  onSuccess: () => void;
}

export function QuestaoForm({ questao, avaliacoes, onSuccess }: QuestaoFormProps) {
  const [pending, startTransition] = useTransition();
  const isEdit = !!questao;

  const form = useForm({
    resolver: zodResolver(questaoSchema),
    defaultValues: {
      avaliacaoId: questao?.avaliacaoId ?? "",
      enunciado: questao?.enunciado ?? "",
      ordem: questao?.ordem ?? 1,
      alternativas: questao
        ? [...questao.alternativas]
            .sort((a, b) => a.ordem - b.ordem)
            .map((a) => ({ texto: a.texto, correta: a.correta }))
        : [
            { texto: "", correta: false },
            { texto: "", correta: false },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "alternativas",
  });

  function onSubmit(values: QuestaoInput) {
    startTransition(async () => {
      const result = isEdit
        ? await editarQuestaoAction(questao!.id, values)
        : await criarQuestaoAction(values);

      if (result.success) {
        toast.success(isEdit ? "Questão atualizada" : "Questão criada");
        if (!isEdit) form.reset();
        onSuccess();
      } else {
        toast.error(result.error);
      }
    });
  }

  const alternativasErrors = form.formState.errors.alternativas;
  const alternativasError = Array.isArray(alternativasErrors)
    ? undefined
    : alternativasErrors?.message ?? alternativasErrors?.root?.message;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="avaliacaoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avaliação</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a avaliação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {avaliacoes.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.cursoTitulo} — {a.titulo}
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
          name="enunciado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enunciado</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ordem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordem</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} value={field.value as number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Alternativas</FormLabel>
          <div className="space-y-2">
            {fields.map((item, index) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="size-4 shrink-0 rounded border-input accent-brand-teal"
                    checked={form.watch(`alternativas.${index}.correta`)}
                    onChange={(e) =>
                      form.setValue(`alternativas.${index}.correta`, e.target.checked)
                    }
                    title="Marcar como correta"
                  />
                  <Input
                    {...form.register(`alternativas.${index}.texto`)}
                    placeholder={`Alternativa ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={fields.length <= 2}
                    onClick={() => remove(index)}
                    aria-label="Remover alternativa"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                {form.formState.errors.alternativas?.[index]?.texto && (
                  <p className="pl-6 text-xs text-destructive">
                    {form.formState.errors.alternativas[index]?.texto?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
          {alternativasError && (
            <p className="text-sm text-destructive">{alternativasError}</p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ texto: "", correta: false })}
          >
            <Plus className="size-4" />
            Adicionar alternativa
          </Button>
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar questão"}
        </Button>
      </form>
    </Form>
  );
}
