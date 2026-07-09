"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";
import { updatePerfilSchema } from "@/lib/validators";

export async function updatePerfilAction(input: unknown) {
  const session = await requireSession();
  const parsed = updatePerfilSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      avatarUrl: parsed.data.avatarUrl || null,
    },
  });

  revalidatePath("/aluno/perfil");
  return { success: true as const };
}
