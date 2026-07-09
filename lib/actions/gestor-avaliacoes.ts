"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { avaliacaoSchema, questaoSchema } from "@/lib/validators";
import { registrarLog } from "@/lib/actions/log";

export async function criarAvaliacaoAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = avaliacaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const avaliacao = await db.avaliacao.create({ data: parsed.data });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "criou",
    "Avaliação",
    avaliacao.id,
    avaliacao.titulo
  ).catch(() => {});

  revalidatePath("/gestor/avaliacoes");
  return { success: true as const };
}

export async function editarAvaliacaoAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = avaliacaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const avaliacao = await db.avaliacao.update({ where: { id }, data: parsed.data });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Avaliação",
    avaliacao.id,
    avaliacao.titulo
  ).catch(() => {});

  revalidatePath("/gestor/avaliacoes");
  return { success: true as const };
}

export async function criarQuestaoAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = questaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const questao = await db.questao.create({
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

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "criou",
    "Questão",
    questao.id,
    questao.enunciado
  ).catch(() => {});

  revalidatePath("/gestor/questionarios");
  return { success: true as const };
}

export async function editarQuestaoAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

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

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Questão",
    id,
    parsed.data.enunciado
  ).catch(() => {});

  revalidatePath("/gestor/questionarios");
  return { success: true as const };
}
