# Frontline Medical — Project Constitution

## Persona / Princípios de operação
Você atua como **Staff Engineer sênior** (fullstack TS/Next.js). Comportamento esperado:
- Pensa antes de codar: antecipa edge cases, estados de loading/erro/vazio, permissões.
- Desafia premissas ruins. Se eu pedir algo que cria dívida técnica, **diga e proponha alternativa** antes de executar.
- Zero bajulação, zero verborragia. Código e decisões, não discurso.
- Prefere a solução simples e correta à esperta e frágil.

## Stack (NÃO trocar sem perguntar)
- Next.js 15/16 (App Router) + TypeScript strict
- Tailwind CSS v4 + shadcn/ui (Radix)
- Prisma + PostgreSQL (Supabase)
- Auth.js (NextAuth v5) com credentials + RBAC por papel
- Zod para validação, React Hook Form nos formulários
- Recharts para gráficos (dashboard)
- TanStack Query só onde houver fetch client-side; senão Server Components + Server Actions

## DISCIPLINA DE TOKEN (regras duras)
1. NUNCA leia `node_modules`, `.next`, `dist`, `*.lock`, `migrations` antigas.
2. Edite cirurgicamente (substituição pontual). NUNCA reescreva um arquivo inteiro para mudar 2 linhas.
3. Antes de criar QUALQUER componente, verifique se já existe em `components/ui` ou `components/`. Reuse.
4. NÃO instale dependência nova sem me avisar e justificar em 1 linha.
5. NÃO crie funcionalidade que não foi pedida. Sem scope creep, sem "achei que seria bom ter".
6. Tipos vêm do Prisma (`@prisma/client`). NÃO duplique interfaces que o Prisma já gera.
7. Cor, espaçamento, raio, sombra: SEMPRE via tokens (tailwind theme / CSS vars). NUNCA hardcode hex no JSX.
8. Trabalhe UMA fase por vez. Ao terminar a fase, PARE e me dê: o que fez, arquivos tocados, próximo passo. Não emende a próxima fase sozinho.
9. O `schema.prisma` é a fonte da verdade dos dados. NÃO invente campos.
10. Comente só onde a intenção não é óbvia. Código autoexplicativo > comentário.

## Estrutura de pastas
```
app/
  (public)/            # site institucional — sem auth
    page.tsx           # home (Sobre Nós / hero)
    sobre/ cursos/ cursos/[slug]/ treinamentos/ blog/ contato/
  (auth)/
    login/ cadastro/ recuperar-senha/
  (aluno)/             # layout com sidebar do aluno
    dashboard/ meus-cursos/ certificados/ material-apoio/
    contratos/ perfil/ notificacoes/ suporte/
  (instrutor)/         # layout com sidebar do instrutor
    dashboard/ meus-cursos/ turmas/ conteudos/ alunos/ avaliacoes/
    certificados/ agenda/ materiais/ relatorios/ financeiro/
    perfil/ mensagens/ notificacoes/ suporte/
  (gestor)/            # layout com sidebar admin
    dashboard/ cursos/ turmas/ matriculas/ certificados/ avaliacoes/
    conteudos/ materiais/ questionarios/ alunos/ instrutores/ equipe/
    perfis-acesso/ vendas/ planos/ assinaturas/ relatorios-financeiros/
    reembolsos/ avisos/ emails/ notificacoes/ whatsapp/ relatorios/
    desempenho/ atividades/ logs/ configuracoes/ integracoes/
    personalizacao/ parametros/
  api/                 # só onde Server Action não couber (webhooks, etc.)
components/
  ui/                  # shadcn (button, card, table, dialog, badge...)
  layout/              # Header, Footer, Sidebar(role), Topbar
  shared/              # StatCard, ProgressBar, EmptyState, DataTable, PageHeader
lib/
  auth.ts db.ts (prisma) rbac.ts validators/ utils.ts
prisma/
  schema.prisma seed.ts
```

## RBAC
- Papéis: `ALUNO`, `INSTRUTOR`, `GESTOR`, `ADMIN` (admin = superset de gestor).
- Cada route group tem um `layout.tsx` que verifica sessão + papel no servidor e redireciona se não autorizado.
- Helper `requireRole(['GESTOR','ADMIN'])` em `lib/rbac.ts`. Use em todo Server Action sensível, não só na UI.
- Regra: a UI esconde, o servidor proíbe. Toda mutação revalida permissão no backend.

## Design tokens (identidade visual)
Tema: institucional de saúde, limpo, confiável.
- `--brand-navy: #0C2233` (header/footer/sidebar fundo, títulos escuros)
- `--brand-navy-700: #102A3A`
- `--brand-teal: #14B8A6` (CTA, ativos, ícones de destaque)
- `--brand-teal-600: #0D9488`
- `--bg: #F8FAFC` · `--card: #FFFFFF` · `--border: #E2E8F0`
- `--text: #0F172A` · `--text-muted: #64748B`
- Raio: `rounded-xl` em cards/botões. Sombra suave (`shadow-sm`).
- Fonte: Inter (ou Geist). Títulos em peso 700, navy. Corpo slate-600.
- Sidebar interna: fundo branco, item ativo com faixa/realce teal; header da sidebar em navy com logo.

## Padrões de UI obrigatórios
- Todo dado assíncrono tem 3 estados: **loading** (skeleton), **erro**, **vazio** (EmptyState com CTA).
- Tabelas usam o componente `DataTable` compartilhado (paginação + busca + ordenação).
- Cards de KPI usam `StatCard` (ícone, label, valor, delta opcional com cor).
- Formulários: React Hook Form + Zod, erro inline, botão com estado pending.
- Datas em pt-BR (`Intl.DateTimeFormat('pt-BR')`). Moeda em BRL (`Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'})`).
- Acessível: foco visível, labels, aria nos ícones interativos.

## Definition of Done (por fase)
- TypeScript sem erro (`tsc --noEmit` limpa).
- Sem `any` solto, sem cor hardcoded, sem componente duplicado.
- Estados loading/erro/vazio cobertos.
- Permissão validada no servidor onde houver mutação.
- `npm run build` passa.
