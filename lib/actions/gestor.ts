"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { avisoSchema } from "@/lib/validators";
import type { Role } from "@/lib/generated/prisma/client";

export async function enviarAvisoAction(input: unknown) {
  await requireRole(["GESTOR", "ADMIN"]);

  const parsed = avisoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const roles: Role[] =
    parsed.data.publico === "TODOS"
      ? ["ALUNO", "INSTRUTOR"]
      : [parsed.data.publico];

  const destinatarios = await db.user.findMany({
    where: { role: { in: roles } },
    select: { id: true },
  });

  if (destinatarios.length === 0) {
    return {
      success: false as const,
      error: "Nenhum usuário encontrado para esse público",
    };
  }

  await db.notificacao.createMany({
    data: destinatarios.map((user) => ({
      userId: user.id,
      titulo: parsed.data.titulo,
      mensagem: parsed.data.mensagem,
    })),
  });

  revalidatePath("/gestor/avisos");
  revalidatePath("/gestor/notificacoes");
  return { success: true as const, total: destinatarios.length };
}
