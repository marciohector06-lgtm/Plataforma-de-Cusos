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
  criarAlunoSchema,
  editarAlunoSchema,
} from "@/lib/validators";
import { registrarLog } from "@/lib/actions/log";

async function emailJaExiste(email: string) {
  const existente = await db.user.findUnique({ where: { email } });
  return !!existente;
}

export async function criarMembroEquipeAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

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
  const membro = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
    },
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "criou",
    "Membro da equipe",
    membro.id,
    membro.name
  ).catch(() => {});

  revalidatePath("/gestor/equipe");
  return { success: true as const };
}

export async function editarMembroEquipeAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = editarMembroEquipeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const membro = await db.user.update({
    where: { id },
    data: {
      name: parsed.data.name,
      role: parsed.data.role,
      ...(parsed.data.password
        ? { passwordHash: await bcrypt.hash(parsed.data.password, 10) }
        : {}),
    },
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Membro da equipe",
    membro.id,
    membro.name
  ).catch(() => {});

  revalidatePath("/gestor/equipe");
  return { success: true as const };
}

export async function criarInstrutorAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

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
  const instrutor = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: "INSTRUTOR",
    },
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "criou",
    "Instrutor",
    instrutor.id,
    instrutor.name
  ).catch(() => {});

  revalidatePath("/gestor/instrutores");
  return { success: true as const };
}

export async function editarInstrutorAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = editarInstrutorSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const instrutor = await db.user.update({
    where: { id },
    data: {
      name: parsed.data.name,
      ...(parsed.data.password
        ? { passwordHash: await bcrypt.hash(parsed.data.password, 10) }
        : {}),
    },
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Instrutor",
    instrutor.id,
    instrutor.name
  ).catch(() => {});

  revalidatePath("/gestor/instrutores");
  return { success: true as const };
}

export async function criarAlunoAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = criarAlunoSchema.safeParse(input);
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
  const aluno = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: "ALUNO",
    },
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "criou",
    "Aluno",
    aluno.id,
    aluno.name
  ).catch(() => {});

  revalidatePath("/gestor/alunos");
  return { success: true as const };
}

export async function editarAlunoAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = editarAlunoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const aluno = await db.user.update({
    where: { id },
    data: {
      name: parsed.data.name,
      ...(parsed.data.password
        ? { passwordHash: await bcrypt.hash(parsed.data.password, 10) }
        : {}),
    },
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Aluno",
    aluno.id,
    aluno.name
  ).catch(() => {});

  revalidatePath("/gestor/alunos");
  return { success: true as const };
}
