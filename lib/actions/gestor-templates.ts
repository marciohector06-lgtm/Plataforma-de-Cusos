"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { emailTemplateSchema, whatsappTemplateSchema } from "@/lib/validators";
import { registrarLog } from "@/lib/actions/log";

export async function criarEmailTemplateAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = emailTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const template = await db.emailTemplate.create({ data: parsed.data });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "criou",
    "Modelo de e-mail",
    template.id,
    template.nome
  ).catch(() => {});

  revalidatePath("/gestor/emails");
  return { success: true as const };
}

export async function editarEmailTemplateAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = emailTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const template = await db.emailTemplate.update({ where: { id }, data: parsed.data });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Modelo de e-mail",
    template.id,
    template.nome
  ).catch(() => {});

  revalidatePath("/gestor/emails");
  return { success: true as const };
}

export async function criarWhatsappTemplateAction(input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = whatsappTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const template = await db.whatsappTemplate.create({ data: parsed.data });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "criou",
    "Modelo de WhatsApp",
    template.id,
    template.nome
  ).catch(() => {});

  revalidatePath("/gestor/whatsapp");
  return { success: true as const };
}

export async function editarWhatsappTemplateAction(id: string, input: unknown) {
  const session = await requireRole(["GESTOR", "ADMIN"]);

  const parsed = whatsappTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const template = await db.whatsappTemplate.update({ where: { id }, data: parsed.data });

  await registrarLog(
    session.user.id,
    session.user.name ?? session.user.email ?? "Desconhecido",
    "editou",
    "Modelo de WhatsApp",
    template.id,
    template.nome
  ).catch(() => {});

  revalidatePath("/gestor/whatsapp");
  return { success: true as const };
}
