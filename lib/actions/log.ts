import { db } from "@/lib/db";

export async function registrarLog(
  userId: string,
  userNome: string,
  acao: string,
  entidade: string,
  entidadeId?: string,
  detalhes?: string
) {
  await db.logAtividade.create({
    data: { userId, userNome, acao, entidade, entidadeId, detalhes },
  });
}
