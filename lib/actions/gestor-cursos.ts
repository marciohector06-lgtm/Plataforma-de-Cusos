"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { cursoSchema, turmaSchema, conteudoSchema } from "@/lib/validators";
import { registrarLog } from "@/lib/actions/log";

export async function criarCursoAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = cursoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const slugExistente = await db.curso.findUnique({ where: { slug: parsed.data.slug } });
  if (slugExistente) {
    return { success: false as const, error: "Já existe um curso com este slug" };
  }

  const curso = await db.curso.create({ data: parsed.data });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "criou",
    "Curso",
    curso.id,
    curso.titulo
  ).catch(() => {});

  revalidatePath("/gestor/cursos");
  revalidatePath("/cursos");
  return { success: true as const };
}

export async function editarCursoAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = cursoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const slugExistente = await db.curso.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (slugExistente) {
    return { success: false as const, error: "Já existe um curso com este slug" };
  }

  const curso = await db.curso.update({ where: { id }, data: parsed.data });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Curso",
    curso.id,
    curso.titulo
  ).catch(() => {});

  revalidatePath("/gestor/cursos");
  revalidatePath("/cursos");
  return { success: true as const };
}

export async function criarTurmaAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = turmaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const turma = await db.turma.create({
    data: {
      cursoId: parsed.data.cursoId,
      instrutorId: parsed.data.instrutorId,
      nome: parsed.data.nome,
      dataInicio: new Date(parsed.data.dataInicio),
      dataFim: new Date(parsed.data.dataFim),
      vagas: parsed.data.vagas,
      status: parsed.data.status,
    },
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "criou",
    "Turma",
    turma.id,
    turma.nome
  ).catch(() => {});

  revalidatePath("/gestor/turmas");
  return { success: true as const };
}

export async function editarTurmaAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = turmaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const turma = await db.turma.update({
    where: { id },
    data: {
      cursoId: parsed.data.cursoId,
      instrutorId: parsed.data.instrutorId,
      nome: parsed.data.nome,
      dataInicio: new Date(parsed.data.dataInicio),
      dataFim: new Date(parsed.data.dataFim),
      vagas: parsed.data.vagas,
      status: parsed.data.status,
    },
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Turma",
    turma.id,
    turma.nome
  ).catch(() => {});

  revalidatePath("/gestor/turmas");
  return { success: true as const };
}

export async function criarConteudoAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = conteudoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const conteudo = await db.conteudo.create({
    data: {
      cursoId: parsed.data.cursoId,
      titulo: parsed.data.titulo,
      tipo: parsed.data.tipo,
      url: parsed.data.url?.trim() || null,
      corpo: parsed.data.corpo?.trim() || null,
      ordem: parsed.data.ordem,
    },
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "criou",
    "Conteúdo",
    conteudo.id,
    conteudo.titulo
  ).catch(() => {});

  revalidatePath("/gestor/conteudos");
  revalidatePath("/gestor/materiais");
  return { success: true as const };
}

export async function editarConteudoAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = conteudoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const conteudo = await db.conteudo.update({
    where: { id },
    data: {
      cursoId: parsed.data.cursoId,
      titulo: parsed.data.titulo,
      tipo: parsed.data.tipo,
      url: parsed.data.url?.trim() || null,
      corpo: parsed.data.corpo?.trim() || null,
      ordem: parsed.data.ordem,
    },
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Conteúdo",
    conteudo.id,
    conteudo.titulo
  ).catch(() => {});

  revalidatePath("/gestor/conteudos");
  revalidatePath("/gestor/materiais");
  return { success: true as const };
}
