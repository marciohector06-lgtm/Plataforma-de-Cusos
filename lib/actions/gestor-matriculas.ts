"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma/client";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { criarMatriculaSchema, editarMatriculaSchema } from "@/lib/validators";
import { registrarLog } from "@/lib/actions/log";

export async function criarMatriculaAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = criarMatriculaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  try {
    const matricula = await db.matricula.create({ data: parsed.data });

    await registrarLog(
      session.user.id,
      session.user.name ?? session.user.email ?? "Desconhecido",
      "criou",
      "Matrícula",
      matricula.id
    ).catch(() => {});

    revalidatePath("/gestor/matriculas");
    return { success: true as const };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false as const, error: "Aluno já matriculado nesta turma" };
    }
    throw error;
  }
}

export async function editarMatriculaAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = editarMatriculaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const matricula = await db.matricula.update({ where: { id }, data: parsed.data });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Matrícula",
    matricula.id
  ).catch(() => {});

  revalidatePath("/gestor/matriculas");
  return { success: true as const };
}
