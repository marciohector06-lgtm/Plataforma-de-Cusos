"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  cadastroSchema,
  loginSchema,
  recuperarSenhaSchema,
} from "@/lib/validators";
import type { Role } from "@/lib/generated/prisma/client";

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

const DASHBOARD_POR_ROLE: Record<Role, string> = {
  ALUNO: "/aluno/dashboard",
  INSTRUTOR: "/instrutor/dashboard",
  GESTOR: "/gestor/dashboard",
  ADMIN: "/gestor/dashboard",
};

export async function loginAction(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false as const, error: "E-mail ou senha incorretos" };
    }
    throw error;
  }

  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
    select: { role: true },
  });

  return {
    success: true as const,
    redirectTo: DASHBOARD_POR_ROLE[user?.role ?? "ALUNO"],
  };
}

export async function cadastroAction(input: unknown) {
  const parsed = cadastroSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const existente = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existente) {
    return {
      success: false as const,
      error: "Já existe uma conta com este e-mail",
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    },
  });

  return { success: true as const };
}

export async function recuperarSenhaAction(input: unknown) {
  const parsed = recuperarSenhaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  // TODO (fase futura): gerar PasswordResetToken no schema e enviar e-mail via Resend/Nodemailer.
  return { success: true as const };
}
