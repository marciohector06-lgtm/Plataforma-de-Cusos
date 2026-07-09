import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  AssinaturaStatus,
  ConteudoTipo,
  CursoStatus,
  MatriculaStatus,
  PlanoRecorrencia,
  Role,
  TipoIntegracao,
  TurmaStatus,
  VendaStatus,
} from "@/lib/generated/prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export const roleLabels: Record<Role, string> = {
  ALUNO: "Aluno",
  INSTRUTOR: "Instrutor",
  GESTOR: "Gestor",
  ADMIN: "Administrador",
};

export const cursoStatusLabels: Record<CursoStatus, string> = {
  RASCUNHO: "Rascunho",
  PUBLICADO: "Publicado",
  ARQUIVADO: "Arquivado",
};

export const turmaStatusLabels: Record<TurmaStatus, string> = {
  PLANEJADA: "Planejada",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
};

export const matriculaStatusLabels: Record<MatriculaStatus, string> = {
  ATIVA: "Ativa",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
  TRANCADA: "Trancada",
};

export const vendaStatusLabels: Record<VendaStatus, string> = {
  PENDENTE: "Pendente",
  PAGA: "Paga",
  CANCELADA: "Cancelada",
  REEMBOLSADA: "Reembolsada",
};

export const planoRecorrenciaLabels: Record<PlanoRecorrencia, string> = {
  MENSAL: "Mensal",
  TRIMESTRAL: "Trimestral",
  ANUAL: "Anual",
};

export const assinaturaStatusLabels: Record<AssinaturaStatus, string> = {
  ATIVA: "Ativa",
  CANCELADA: "Cancelada",
  EXPIRADA: "Expirada",
};

export const conteudoTipoLabels: Record<ConteudoTipo, string> = {
  VIDEO: "Vídeo",
  PDF: "PDF",
  TEXTO: "Texto",
  LINK: "Link",
};

export const tipoIntegracaoLabels: Record<TipoIntegracao, string> = {
  WEBHOOK: "Webhook",
  API_KEY: "Chave de API",
  OUTRO: "Outro",
};

export function mascarar(valor: string): string {
  if (valor.length <= 4) return "•".repeat(valor.length);
  return "•".repeat(valor.length - 4) + valor.slice(-4);
}
