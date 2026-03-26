# 🚀 Guia de Lançamento Gratuito: Vórtice CRM (Hoje!)

Para ter o seu CRM com **Banco de Dados Real**, operando na nuvem gratuitamente e pronto para uso HOJE, vamos utilizar a melhor arquitetura de alta performance do mercado (*Stack Serverless*):

1. **Supabase** (Servidor + Banco de Dados PostgreSQL Grátis)
2. **Vercel** (Hospedagem do Site/Sistema Grátis)

Siga os passos rigorosamente abaixo. Deve levar **menos de 10 minutos**.

---

## Passo 1: Criar o Banco de Dados (Supabase)
O Supabase é a versão open-source do Firebase. O plano grátis suporta até 500MB de dados e milhares de requisições.

1. Acesse [https://supabase.com/](https://supabase.com/) e crie uma conta gratuita (pode logar via GitHub).
2. Clique em **"New Project"**.
3. Dê o nome de `Vortice-CRM`, escolha uma senha forte para o banco de dados, e a região `South America (São Paulo)`.
4. Aguarde o banco ser configurado (leva uns 2 minutos).

### 1.1 Configurar as Tabelas
No painel do Supabase, vá no menu esquerdo em **SQL Editor** e clique em "New Query". Copie e cole o código abaixo e clique em **Run** para criar seu banco de dados oficial:

```sql
-- Criação da tabela de Leads
CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cpf_cnpj TEXT,
  value NUMERIC DEFAULT 0,
  stage_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da configuração das colunas do Pipeline
CREATE TABLE pipeline_stages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  position INTEGER NOT NULL
);

-- Inserindo as colunas padrão que você já definiu:
INSERT INTO pipeline_stages (id, name, color, position) VALUES 
('novo', 'Novo Lead', '#3b82f6', 1),
('contato', 'Em Contato', '#10b981', 2),
('proposta', 'Proposta Enviada', '#8b5cf6', 3),
('negociacao', 'Negociação', '#f59e0b', 4),
('ganho', 'Ganhos', '#10b981', 5);

-- Habilitando acesso de Inserção/Leitura anônima para facilitar os primeiros testes (Desligue o RLS temporariamente)
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages DISABLE ROW LEVEL SECURITY;
```

### 1.2 Pegar as Chaves de Acesso
Ainda no Supabase, no menu da esquerda, vá em **Project Settings (engrenagem)** -> **API**.
Você precisará de duas coisas:
1. `Project URL`
2. `Project API Keys (anon / public)`

---

## Passo 2: Configurar o seu CRM Localmente
Agora você precisa dizer ao seu código atual para "conversar" com esse banco de dados.

1. Dentro da pasta raiz do seu projeto `System VT`, crie um arquivo chamado **`.env.local`**
2. Cole as seguintes linhas usando os códigos que você copiou no Passo 1.2:

```env
NEXT_PUBLIC_SUPABASE_URL=cole_aqui_sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=cole_aqui_sua_chave_anon_do_supabase
```

*(Obs: Eu já deixei um arquivo pronto no seu sistema chamado `src/lib/supabase.ts` que vai ler isso sozinho!)*

---

## Passo 3: Conectar o Contexto Atual (Assim que confirmar as chaves)
Até este momento, os Leads estão gravados na "Memória" (quando recarrega a página, eles voltam). Para o banco funcionar, eu vou precisar editar o arquivo `src/context/LeadContext.tsx` trocando o Array na memória por requisições pro banco.

⚠️ **IMPORTANTE:** Assim que você terminar o Passo 1 e o Passo 2 e jogar o arquivo `.env.local` na pasta, me avise dizendo *"Estou pronto, pode plugar no banco!"*.

---

## Passo 4: Colocar o site Online no Vercel (Hospedagem Grátis)
O Next.js pertence à Vercel, então a hospedagem na plataforma oficial deles é imediata e gratuita eternamente para pequenos projetos.

1. Feche tudo, abra o seu terminal e envie seu código para o **GitHub**. Se você não subiu ainda, vá na aba de Source Control do VS Code e publique o repositório no seu GitHub (como Privado).
2. Entre no site [https://vercel.com/](https://vercel.com/) e faça login usando o próprio GitHub.
3. Clique no botão **"Add New..." > "Project"**.
4. Quando a Vercel listar os seus repositórios do GitHub, clique em **Import** no projeto do seu CRM.
5. Em **Environment Variables**, adicione as mesmas coisas que você colocou no arquivo `.env.local`:
   - Name: `NEXT_PUBLIC_SUPABASE_URL` | Value: (sua url)
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Value: (sua chave)
6. Clique em **Deploy**.

🚀 **Pronto! Em 3 minutos, a Vercel vai te dar um link online (ex: vortice-crm.vercel.app) funcionando em todos os computadores para sua equipe usar, gravando clientes no seu banco de dados gratuito de alta performance.**
