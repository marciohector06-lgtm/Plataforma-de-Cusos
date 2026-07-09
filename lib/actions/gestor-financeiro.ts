"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { planoSchema } from "@/lib/validators";
import { registrarLog } from "@/lib/actions/log";

export async function criarPlanoAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = planoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const plano = await db.plano.create({
    data: {
      nome: parsed.data.nome,
      descricao: parsed.data.descricao,
      precoCentavos: Math.round(parsed.data.precoReais * 100),
      recorrencia: parsed.data.recorrencia,
      ativo: parsed.data.ativo,
    },
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "criou",
    "Plano",
    plano.id,
    plano.nome
  ).catch(() => {});

  revalidatePath("/gestor/planos");
  return { success: true as const };
}

export async function editarPlanoAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = planoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const plano = await db.plano.update({
    where: { id },
    data: {
      nome: parsed.data.nome,
      descricao: parsed.data.descricao,
      precoCentavos: Math.round(parsed.data.precoReais * 100),
      recorrencia: parsed.data.recorrencia,
      ativo: parsed.data.ativo,
    },
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Plano",
    plano.id,
    plano.nome
  ).catch(() => {});

  revalidatePath("/gestor/planos");
  return { success: true as const };
}
