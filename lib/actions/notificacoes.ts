"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/rbac";
import { db } from "@/lib/db";

export async function marcarNotificacaoComoLidaAction(id: string, path: string) {
  const session = await requireSession();

  await db.notificacao.updateMany({
    where: { id, userId: session.user.id },
    data: { lida: true },
  });

  revalidatePath(path);
}
