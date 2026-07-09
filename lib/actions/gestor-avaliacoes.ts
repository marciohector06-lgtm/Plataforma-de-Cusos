"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { avaliacaoSchema, questaoSchema } from "@/lib/validators";

export async function criarAvaliacaoAction(input: unknown) {
  await requireRole(["GESTOR", "ADMIN"]);

  const parsed = avaliacaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  await db.avaliacao.create({ data: parsed.data });

  revalidatePath("/gestor/avaliacoes");
  return { success: true as const };
}

export async function editarAvaliacaoAction(id: string, input: unknown) {
  await requireRole(["GESTOR", "ADMIN"]);

  const parsed = avaliacaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  await db.avaliacao.update({ where: { id }, data: parsed.data });

  revalidatePath("/gestor/avaliacoes");
  return { success: true as const };
}

export async function criarQuestaoAction(input: unknown) {
  await requireRole(["GESTOR", "ADMIN"]);

  const parsed = questaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  await db.questao.create({
    data: {
      avaliacaoId: parsed.data.avaliacaoId,
      enunciado: parsed.data.enunciado,
      ordem: parsed.data.ordem,
      alternativas: {
        create: parsed.data.alternativas.map((alt, index) => ({
          texto: alt.texto,
          correta: alt.correta,
          ordem: index + 1,
        })),
      },
    },
  });

  revalidatePath("/gestor/questionarios");
  return { success: true as const };
}

export async function editarQuestaoAction(id: string, input: unknown) {
  await requireRole(["GESTOR", "ADMIN"]);

  const parsed = questaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  try {
    await db.$transaction([
      db.alternativa.deleteMany({ where: { questaoId: id } }),
      db.questao.update({
        where: { id },
        data: {
          avaliacaoId: parsed.data.avaliacaoId,
          enunciado: parsed.data.enunciado,
          ordem: parsed.data.ordem,
          alternativas: {
            create: parsed.data.alternativas.map((alt, index) => ({
              texto: alt.texto,
              correta: alt.correta,
              ordem: index + 1,
            })),
          },
        },
      }),
    ]);
  } catch {
    return {
      success: false as const,
      error:
        "Não foi possível salvar: esta questão já possui respostas de alunos registradas.",
    };
  }

  revalidatePath("/gestor/questionarios");
  return { success: true as const };
}
