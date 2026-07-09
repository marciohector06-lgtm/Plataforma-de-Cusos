import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const cadastroSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome completo"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type CadastroInput = z.infer<typeof cadastroSchema>;

export const recuperarSenhaSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export type RecuperarSenhaInput = z.infer<typeof recuperarSenhaSchema>;

export const updatePerfilSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  avatarUrl: z.union([z.literal(""), z.string().url("URL inválida")]),
});

export type UpdatePerfilInput = z.infer<typeof updatePerfilSchema>;

export const ticketSuporteSchema = z.object({
  assunto: z.string().min(3, "Informe um assunto"),
  mensagem: z.string().min(10, "Descreva melhor o seu problema"),
});

export type TicketSuporteInput = z.infer<typeof ticketSuporteSchema>;

export const contatoSchema = z.object({
  nome: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("E-mail inválido"),
  assunto: z.string().min(3, "Informe um assunto"),
  mensagem: z.string().min(10, "Descreva melhor sua mensagem"),
});

export type ContatoInput = z.infer<typeof contatoSchema>;

export const corrigirTentativaSchema = z.object({
  tentativaId: z.string().min(1),
  nota: z.number().int().min(0, "A nota mínima é 0").max(100, "A nota máxima é 100"),
});

export type CorrigirTentativaInput = z.infer<typeof corrigirTentativaSchema>;

export const avisoSchema = z.object({
  titulo: z.string().min(3, "Informe um título"),
  mensagem: z.string().min(10, "Descreva melhor o aviso"),
  publico: z.enum(["TODOS", "ALUNO", "INSTRUTOR"]),
});

export type AvisoInput = z.infer<typeof avisoSchema>;

export const criarMembroEquipeSchema = z.object({
  name: z.string().min(2, "Informe o nome completo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  role: z.enum(["GESTOR", "ADMIN"]),
});

export type CriarMembroEquipeInput = z.infer<typeof criarMembroEquipeSchema>;

export const editarMembroEquipeSchema = z.object({
  name: z.string().min(2, "Informe o nome completo"),
  role: z.enum(["GESTOR", "ADMIN"]),
  password: z.union([
    z.literal(""),
    z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  ]),
});

export type EditarMembroEquipeInput = z.infer<typeof editarMembroEquipeSchema>;

export const criarInstrutorSchema = z.object({
  name: z.string().min(2, "Informe o nome completo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export type CriarInstrutorInput = z.infer<typeof criarInstrutorSchema>;

export const editarInstrutorSchema = z.object({
  name: z.string().min(2, "Informe o nome completo"),
  password: z.union([
    z.literal(""),
    z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  ]),
});

export type EditarInstrutorInput = z.infer<typeof editarInstrutorSchema>;

export const cursoSchema = z.object({
  titulo: z.string().min(3, "Informe o título do curso"),
  slug: z
    .string()
    .min(3, "Informe o slug")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens"),
  descricao: z.string().min(10, "Descreva melhor o curso"),
  cargaHoraria: z.coerce.number().int().min(1, "Informe a carga horária"),
  autorId: z.string().min(1, "Selecione o instrutor responsável"),
  status: z.enum(["RASCUNHO", "PUBLICADO", "ARQUIVADO"]),
});

export type CursoInput = z.infer<typeof cursoSchema>;

export const turmaSchema = z
  .object({
    cursoId: z.string().min(1, "Selecione o curso"),
    instrutorId: z.string().min(1, "Selecione o instrutor"),
    nome: z.string().min(2, "Informe o nome da turma"),
    dataInicio: z.string().min(1, "Informe a data de início"),
    dataFim: z.string().min(1, "Informe a data de fim"),
    vagas: z.coerce.number().int().min(1, "Informe o número de vagas"),
    status: z.enum(["PLANEJADA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"]),
  })
  .refine((data) => new Date(data.dataFim) > new Date(data.dataInicio), {
    message: "A data de fim deve ser posterior à data de início",
    path: ["dataFim"],
  });

export type TurmaInput = z.infer<typeof turmaSchema>;

export const conteudoSchema = z
  .object({
    cursoId: z.string().min(1, "Selecione o curso"),
    titulo: z.string().min(3, "Informe o título"),
    tipo: z.enum(["VIDEO", "PDF", "TEXTO", "LINK"]),
    url: z.string().optional(),
    corpo: z.string().optional(),
    ordem: z.coerce.number().int().min(1, "Informe a ordem"),
  })
  .refine((data) => data.tipo === "TEXTO" || !!data.url?.trim(), {
    message: "Informe a URL do conteúdo",
    path: ["url"],
  })
  .refine((data) => data.tipo !== "TEXTO" || !!data.corpo?.trim(), {
    message: "Informe o texto do conteúdo",
    path: ["corpo"],
  });

export type ConteudoInput = z.infer<typeof conteudoSchema>;

export const planoSchema = z.object({
  nome: z.string().min(2, "Informe o nome do plano"),
  descricao: z.string().min(10, "Descreva melhor o plano"),
  precoReais: z.coerce.number().min(0, "Informe um preço válido"),
  recorrencia: z.enum(["MENSAL", "TRIMESTRAL", "ANUAL"]),
  ativo: z.boolean(),
});

export type PlanoInput = z.infer<typeof planoSchema>;

export const avaliacaoSchema = z.object({
  cursoId: z.string().min(1, "Selecione o curso"),
  titulo: z.string().min(3, "Informe o título da avaliação"),
  notaMinima: z.coerce.number().int().min(0, "A nota mínima é 0").max(100, "A nota máxima é 100"),
});

export type AvaliacaoInput = z.infer<typeof avaliacaoSchema>;

export const questaoSchema = z.object({
  avaliacaoId: z.string().min(1, "Selecione a avaliação"),
  enunciado: z.string().min(5, "Informe o enunciado"),
  ordem: z.coerce.number().int().min(1, "Informe a ordem"),
  alternativas: z
    .array(
      z.object({
        texto: z.string().min(1, "Informe o texto da alternativa"),
        correta: z.boolean(),
      })
    )
    .min(2, "Informe pelo menos 2 alternativas")
    .refine((alts) => alts.some((a) => a.correta), {
      message: "Marque ao menos uma alternativa como correta",
    }),
});

export type QuestaoInput = z.infer<typeof questaoSchema>;

export const criarAlunoSchema = z.object({
  name: z.string().min(2, "Informe o nome completo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export type CriarAlunoInput = z.infer<typeof criarAlunoSchema>;

export const editarAlunoSchema = z.object({
  name: z.string().min(2, "Informe o nome completo"),
  password: z.union([
    z.literal(""),
    z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  ]),
});

export type EditarAlunoInput = z.infer<typeof editarAlunoSchema>;

export const criarMatriculaSchema = z.object({
  alunoId: z.string().min(1, "Selecione o aluno"),
  turmaId: z.string().min(1, "Selecione a turma"),
  status: z.enum(["ATIVA", "CONCLUIDA", "CANCELADA", "TRANCADA"]),
});

export type CriarMatriculaInput = z.infer<typeof criarMatriculaSchema>;

export const editarMatriculaSchema = z.object({
  status: z.enum(["ATIVA", "CONCLUIDA", "CANCELADA", "TRANCADA"]),
  progresso: z.coerce.number().int().min(0, "O progresso mínimo é 0").max(100, "O progresso máximo é 100"),
});

export type EditarMatriculaInput = z.infer<typeof editarMatriculaSchema>;

export const configuracaoPlataformaSchema = z.object({
  nomeInstituicao: z.string().min(2, "Informe o nome da instituição"),
  emailContato: z.string().email("E-mail inválido"),
  telefoneContato: z.string().optional(),
  endereco: z.string().optional(),
});

export type ConfiguracaoPlataformaInput = z.infer<typeof configuracaoPlataformaSchema>;

export const parametroSistemaSchema = z.object({
  notaMinimaPadrao: z.coerce.number().int().min(0, "Mínimo 0").max(100, "Máximo 100"),
  diasValidadeCertificado: z.coerce.number().int().min(0, "Mínimo 0"),
  vagasPadraoTurma: z.coerce.number().int().min(1, "Informe ao menos 1 vaga"),
});

export type ParametroSistemaInput = z.infer<typeof parametroSistemaSchema>;

export const personalizacaoSchema = z.object({
  nomeExibicao: z.string().min(2, "Informe o nome de exibição"),
  logoUrl: z.union([z.literal(""), z.string().url("URL inválida")]),
  corPrimaria: z.string().min(4, "Informe uma cor válida"),
  corSecundaria: z.string().min(4, "Informe uma cor válida"),
});

export type PersonalizacaoInput = z.infer<typeof personalizacaoSchema>;

export const integracaoSchema = z.object({
  nome: z.string().min(2, "Informe o nome da integração"),
  tipo: z.enum(["WEBHOOK", "API_KEY", "OUTRO"]),
  valor: z.string().min(1, "Informe o valor/chave"),
  ativo: z.boolean(),
});

export type IntegracaoInput = z.infer<typeof integracaoSchema>;

export const emailTemplateSchema = z.object({
  nome: z.string().min(2, "Informe o nome do modelo"),
  assunto: z.string().min(2, "Informe o assunto"),
  corpo: z.string().min(10, "Descreva o corpo do e-mail"),
  ativo: z.boolean(),
});

export type EmailTemplateInput = z.infer<typeof emailTemplateSchema>;

export const whatsappTemplateSchema = z.object({
  nome: z.string().min(2, "Informe o nome do modelo"),
  corpo: z.string().min(10, "Descreva o corpo da mensagem"),
  ativo: z.boolean(),
});

export type WhatsappTemplateInput = z.infer<typeof whatsappTemplateSchema>;

export const mensagemSchema = z.object({
  destinatarioId: z.string().min(1, "Selecione o destinatário"),
  corpo: z.string().min(1, "Escreva uma mensagem"),
});

export type MensagemInput = z.infer<typeof mensagemSchema>;
