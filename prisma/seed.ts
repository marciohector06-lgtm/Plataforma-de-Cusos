import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../lib/db";

async function main() {
  const senhaPadrao = await bcrypt.hash("senha123", 10);

  const [admin, gestor, instrutor, aluno] = await Promise.all([
    db.user.upsert({
      where: { email: "admin@frontline.com" },
      update: {},
      create: {
        name: "Admin",
        email: "admin@frontline.com",
        passwordHash: senhaPadrao,
        role: "ADMIN",
      },
    }),
    db.user.upsert({
      where: { email: "gestor@frontline.com" },
      update: {},
      create: {
        name: "Gestora Ana",
        email: "gestor@frontline.com",
        passwordHash: senhaPadrao,
        role: "GESTOR",
      },
    }),
    db.user.upsert({
      where: { email: "instrutor@frontline.com" },
      update: {},
      create: {
        name: "Instrutor Carlos",
        email: "instrutor@frontline.com",
        passwordHash: senhaPadrao,
        role: "INSTRUTOR",
      },
    }),
    db.user.upsert({
      where: { email: "aluno@frontline.com" },
      update: {},
      create: {
        name: "Aluna Beatriz",
        email: "aluno@frontline.com",
        passwordHash: senhaPadrao,
        role: "ALUNO",
      },
    }),
  ]);

  const curso = await db.curso.upsert({
    where: { slug: "suporte-basico-de-vida" },
    update: {},
    create: {
      titulo: "Suporte Básico de Vida",
      slug: "suporte-basico-de-vida",
      descricao: "Fundamentos de atendimento de emergência e RCP.",
      cargaHoraria: 20,
      status: "PUBLICADO",
      autorId: instrutor.id,
    },
  });

  const turma = await db.turma.create({
    data: {
      cursoId: curso.id,
      instrutorId: instrutor.id,
      nome: "Turma 2026.1",
      dataInicio: new Date("2026-08-01"),
      dataFim: new Date("2026-08-30"),
      vagas: 30,
      status: "PLANEJADA",
    },
  });

  const matricula = await db.matricula.upsert({
    where: { alunoId_turmaId: { alunoId: aluno.id, turmaId: turma.id } },
    update: {},
    create: {
      alunoId: aluno.id,
      turmaId: turma.id,
      progresso: 40,
    },
  });

  await db.conteudo.createMany({
    data: [
      {
        cursoId: curso.id,
        titulo: "Introdução ao SBV",
        tipo: "VIDEO",
        url: "https://example.com/videos/introducao-sbv",
        ordem: 1,
      },
      {
        cursoId: curso.id,
        titulo: "Apostila de RCP",
        tipo: "PDF",
        url: "https://example.com/materiais/apostila-rcp.pdf",
        ordem: 2,
      },
    ],
    skipDuplicates: true,
  });

  await db.contrato.upsert({
    where: { id: `${aluno.id}-${turma.id}-contrato` },
    update: {},
    create: {
      id: `${aluno.id}-${turma.id}-contrato`,
      alunoId: aluno.id,
      turmaId: turma.id,
      status: "PENDENTE",
    },
  });

  await db.notificacao.createMany({
    data: [
      {
        userId: aluno.id,
        titulo: "Bem-vinda à Frontline Medical",
        mensagem: "Sua matrícula na Turma 2026.1 foi confirmada.",
      },
    ],
    skipDuplicates: true,
  });

  const avaliacaoExistente = await db.avaliacao.findFirst({
    where: { cursoId: curso.id, titulo: "Avaliação final — Suporte Básico de Vida" },
  });

  const avaliacao =
    avaliacaoExistente ??
    (await db.avaliacao.create({
      data: {
        cursoId: curso.id,
        titulo: "Avaliação final — Suporte Básico de Vida",
        notaMinima: 60,
        questoes: {
          create: [
            {
              enunciado: "Qual a proporção de compressões e ventilações na RCP em adultos?",
              ordem: 1,
              alternativas: {
                create: [
                  { texto: "30 compressões para 2 ventilações", correta: true, ordem: 1 },
                  { texto: "15 compressões para 1 ventilação", correta: false, ordem: 2 },
                  { texto: "10 compressões para 2 ventilações", correta: false, ordem: 3 },
                ],
              },
            },
            {
              enunciado: "Qual o primeiro passo ao encontrar uma vítima desacordada?",
              ordem: 2,
              alternativas: {
                create: [
                  { texto: "Iniciar compressões imediatamente", correta: false, ordem: 1 },
                  { texto: "Verificar a responsividade e acionar o socorro", correta: true, ordem: 2 },
                  { texto: "Aguardar a vítima acordar sozinha", correta: false, ordem: 3 },
                ],
              },
            },
          ],
        },
      },
      include: { questoes: { include: { alternativas: true } } },
    }));

  const questoes = await db.questao.findMany({
    where: { avaliacaoId: avaliacao.id },
    include: { alternativas: true },
    orderBy: { ordem: "asc" },
  });

  const tentativaExistente = await db.tentativaAvaliacao.findUnique({
    where: {
      matriculaId_avaliacaoId: { matriculaId: matricula.id, avaliacaoId: avaliacao.id },
    },
  });

  if (!tentativaExistente) {
    await db.tentativaAvaliacao.create({
      data: {
        matriculaId: matricula.id,
        avaliacaoId: avaliacao.id,
        status: "CORRIGIDA",
        nota: 100,
        corrigidaEm: new Date(),
        respostas: {
          create: questoes.map((questao) => ({
            questaoId: questao.id,
            alternativaId: questao.alternativas.find((a) => a.correta)!.id,
          })),
        },
      },
    });
  }

  await db.blogPost.upsert({
    where: { slug: "como-agir-em-uma-parada-cardiorrespiratoria" },
    update: {},
    create: {
      titulo: "Como agir em uma parada cardiorrespiratória",
      slug: "como-agir-em-uma-parada-cardiorrespiratoria",
      resumo:
        "Os primeiros minutos são decisivos. Veja o passo a passo do suporte básico de vida.",
      corpo:
        "Em uma parada cardiorrespiratória, os primeiros minutos definem o prognóstico da vítima. Reconhecer os sinais, acionar o serviço de emergência e iniciar a reanimação cardiopulmonar (RCP) rapidamente aumentam significativamente as chances de sobrevivência. Nossos cursos de Suporte Básico de Vida preparam profissionais e leigos para agir com segurança e eficácia nesses momentos críticos.",
      autorId: instrutor.id,
      publicadoEm: new Date("2026-06-01"),
    },
  });

  const planoMensal = await db.plano.upsert({
    where: { id: "plano-mensal-seed" },
    update: {},
    create: {
      id: "plano-mensal-seed",
      nome: "Acesso Mensal",
      descricao: "Acesso a todos os cursos publicados, renovação mensal.",
      precoCentavos: 9900,
      recorrencia: "MENSAL",
    },
  });

  await db.plano.upsert({
    where: { id: "plano-anual-seed" },
    update: {},
    create: {
      id: "plano-anual-seed",
      nome: "Acesso Anual",
      descricao: "Acesso a todos os cursos publicados, renovação anual com desconto.",
      precoCentavos: 99000,
      recorrencia: "ANUAL",
    },
  });

  const assinaturaExistente = await db.assinatura.findFirst({
    where: { userId: aluno.id, planoId: planoMensal.id },
  });

  if (!assinaturaExistente) {
    await db.assinatura.create({
      data: {
        userId: aluno.id,
        planoId: planoMensal.id,
        status: "ATIVA",
      },
    });
  }

  const vendaExistente = await db.venda.findFirst({
    where: { compradorId: aluno.id, planoId: planoMensal.id },
  });

  if (!vendaExistente) {
    await db.venda.create({
      data: {
        compradorId: aluno.id,
        planoId: planoMensal.id,
        descricao: "Assinatura Acesso Mensal",
        valorCentavos: 9900,
        status: "PAGA",
      },
    });
  }

  console.log({ admin: admin.email, gestor: gestor.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
