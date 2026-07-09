"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { corrigirTentativaSchema } from "@/lib/validators";

export async function corrigirTentativaAction(input: unknown) {
  const session = await requireRole(["INSTRUTOR"]);

  const parsed = corrigirTentativaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const tentativa = await db.tentativaAvaliacao.findUnique({
    where: { id: parsed.data.tentativaId },
    include: { avaliacao: { include: { curso: true } } },
  });

  if (!tentativa || tentativa.avaliacao.curso.autorId !== session.user.id) {
    return { success: false as const, error: "Tentativa não encontrada" };
  }

  await db.tentativaAvaliacao.update({
    where: { id: tentativa.id },
    data: {
      nota: parsed.data.nota,
      status: "CORRIGIDA",
      corrigidaEm: new Date(),
    },
  });

  revalidatePath(`/instrutor/avaliacoes/${tentativa.avaliacaoId}`);
  return { success: true as const };
}
