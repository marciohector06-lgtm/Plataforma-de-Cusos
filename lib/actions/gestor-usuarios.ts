"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import {
  criarMembroEquipeSchema,
  editarMembroEquipeSchema,
  criarInstrutorSchema,
  editarInstrutorSchema,
} from "@/lib/validators";

async function emailJaExiste(email: string) {
  const existente = await db.user.findUnique({ where: { email } });
  return !!existente;
}

export async function criarMembroEquipeAction(input: unknown) {
  await requireRole(["GESTOR", "ADMIN"]);

  const parsed = criarMembroEquipeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  if (await emailJaExiste(parsed.data.email)) {
    return { success: false as const, error: "Já existe uma conta com este e-mail" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
    },
  });

  revalidatePath("/gestor/equipe");
  return { success: true as const };
}

export async function editarMembroEquipeAction(id: string, input: unknown) {
  await requireRole(["GESTOR", "ADMIN"]);

  const parsed = editarMembroEquipeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  await db.user.update({
    where: { id },
    data: {
      name: parsed.data.name,
      role: parsed.data.role,
      ...(parsed.data.password
        ? { passwordHash: await bcrypt.hash(parsed.data.password, 10) }
        : {}),
    },
  });

  revalidatePath("/gestor/equipe");
  return { success: true as const };
}

export async function criarInstrutorAction(input: unknown) {
  await requireRole(["GESTOR", "ADMIN"]);

  const parsed = criarInstrutorSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  if (await emailJaExiste(parsed.data.email)) {
    return { success: false as const, error: "Já existe uma conta com este e-mail" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: "INSTRUTOR",
    },
  });

  revalidatePath("/gestor/instrutores");
  return { success: true as const };
}

export async function editarInstrutorAction(id: string, input: unknown) {
  await requireRole(["GESTOR", "ADMIN"]);

  const parsed = editarInstrutorSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  await db.user.update({
    where: { id },
    data: {
      name: parsed.data.name,
      ...(parsed.data.password
        ? { passwordHash: await bcrypt.hash(parsed.data.password, 10) }
        : {}),
    },
  });

  revalidatePath("/gestor/instrutores");
  return { success: true as const };
}
