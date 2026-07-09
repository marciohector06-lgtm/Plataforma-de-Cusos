"use server";

import { db } from "@/lib/db";
import { contatoSchema } from "@/lib/validators";

export async function enviarMensagemContatoAction(input: unknown) {
  const parsed = contatoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  await db.mensagemContato.create({ data: parsed.data });

  return { success: true as const };
}
