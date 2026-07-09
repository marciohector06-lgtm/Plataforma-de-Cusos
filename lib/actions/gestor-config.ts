"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import {
  configuracaoPlataformaSchema,
  parametroSistemaSchema,
  personalizacaoSchema,
  integracaoSchema,
} from "@/lib/validators";
import { registrarLog } from "@/lib/actions/log";

const SINGLETON_ID = "singleton";

export async function salvarConfiguracaoAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = configuracaoPlataformaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  await db.configuracaoPlataforma.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...parsed.data },
    update: parsed.data,
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Configurações da plataforma"
  ).catch(() => {});

  revalidatePath("/gestor/configuracoes");
  return { success: true as const };
}

export async function salvarParametroAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = parametroSistemaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  await db.parametroSistema.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...parsed.data },
    update: parsed.data,
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Parâmetros do sistema"
  ).catch(() => {});

  revalidatePath("/gestor/parametros");
  return { success: true as const };
}

export async function salvarPersonalizacaoAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = personalizacaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const data = {
    nomeExibicao: parsed.data.nomeExibicao,
    logoUrl: parsed.data.logoUrl?.trim() || null,
    corPrimaria: parsed.data.corPrimaria,
    corSecundaria: parsed.data.corSecundaria,
  };

  await db.personalizacao.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...data },
    update: data,
  });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Personalização"
  ).catch(() => {});

  revalidatePath("/gestor/personalizacao");
  return { success: true as const };
}

export async function criarIntegracaoAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = integracaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const integracao = await db.integracao.create({ data: parsed.data });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "criou",
    "Integração",
    integracao.id,
    integracao.nome
  ).catch(() => {});

  revalidatePath("/gestor/integracoes");
  return { success: true as const };
}

export async function editarIntegracaoAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = integracaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const integracao = await db.integracao.update({ where: { id }, data: parsed.data });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Integração",
    integracao.id,
    integracao.nome
  ).catch(() => {});

  revalidatePath("/gestor/integracoes");
  return { success: true as const };
}
