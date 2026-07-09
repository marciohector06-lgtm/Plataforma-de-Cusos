"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { ticketSuporteSchema } from "@/lib/validators";

export async function createTicketSuporteAction(input: unknown) {
  const session = await requireSession();
  const parsed = ticketSuporteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  await db.ticketSuporte.create({
    data: {
      userId: session.user.id,
      assunto: parsed.data.assunto,
      mensagem: parsed.data.mensagem,
    },
  });

  revalidatePath("/aluno/suporte");
  return { success: true as const };
}
