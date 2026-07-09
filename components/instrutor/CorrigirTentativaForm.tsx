"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { corrigirTentativaAction } from "@/lib/actions/avaliacoes";
import { corrigirTentativaSchema, type CorrigirTentativaInput } from "@/lib/validators";

interface CorrigirTentativaFormProps {
  tentativaId: string;
  notaSugerida: number;
}

export function CorrigirTentativaForm({
  tentativaId,
  notaSugerida,
}: CorrigirTentativaFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<CorrigirTentativaInput>({
    resolver: zodResolver(corrigirTentativaSchema),
    defaultValues: { tentativaId, nota: notaSugerida },
  });

  function onSubmit(values: CorrigirTentativaInput) {
    startTransition(async () => {
      const result = await corrigirTentativaAction(values);
      if (result.success) {
        toast.success("Tentativa corrigida");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap items-end gap-2"
      >
        <input type="hidden" {...form.register("tentativaId")} />

        <FormField
          control={form.control}
          name="nota"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  className="w-20"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Salvando..." : `Corrigir (sugestão: ${notaSugerida})`}
        </Button>
      </form>
    </Form>
  );
}
