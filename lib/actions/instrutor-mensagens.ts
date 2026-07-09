"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { mensagemSchema } from "@/lib/validators";

export async function enviarMensagemAction(input: unknown) {
  const session = await requireRole(["INSTRUTOR"]);

  const parsed = mensagemSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  await db.mensagem.create({
    data: {
      remetenteId: session.user.id,
      destinatarioId: parsed.data.destinatarioId,
      corpo: parsed.data.corpo,
    },
  });

  revalidatePath("/instrutor/mensagens");
  return { success: true as const };
}
