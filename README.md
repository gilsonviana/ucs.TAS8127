# com.TechStore

Uma plataforma de e-commerce completa para venda de peças de computador, construída com Next.js, TypeScript, SQLite e Tailwind CSS.

**Ideal para iniciantes aprenderem desenvolvimento web full-stack em um projeto real!**

---

## 🛠️ Tecnologias Utilizadas

Este projeto usa tecnologias modernas e populares no mercado:

- **Framework Web:** Next.js 16 (estrutura para criar aplicações web rápidas)
- **Linguagem:** TypeScript (JavaScript com verificação de tipos)
- **Estilo/Design:** Tailwind CSS v4 (biblioteca CSS pronta para uso)
- **Banco de Dados:** SQLite com `better-sqlite3` (banco de dados simples, sem servidor)
- **Autenticação:** JWT (`jsonwebtoken`) + bcrypt (login seguro)
- **Estado da Aplicação:** Zustand (carrinho) + React Context (autenticação)
- **Idiomas:** next-intl — Suporte para português (pt-BR) e inglês (en-US)
- **Formulários:** React Hook Form + Zod (validação de dados)
- **Testes:** Vitest + React Testing Library (garantir que o código funciona)

---

## ⚡ Comece Rápido

### Opção 1: Com Docker (Recomendado para Iniciantes)

Se você tem Docker instalado, é o jeito mais fácil. Você **não precisa instalar Node.js na sua máquina**.

```bash
# 1. Copie o arquivo de configuração
cp .env.example .env

# 2. Inicie a aplicação (isso vai baixar e configurar tudo automaticamente)
docker compose up --build

# Pronto! Abra: http://localhost:3000
```

**Próximas vezes:** 
```bash
docker compose up              # Inicia sem recompilar
docker compose down            # Para a aplicação
docker compose down -v         # Para e apaga os dados
```

### Opção 2: Instalação Local (Node.js Requerido)

Se você prefere rodar localmente, você precisa de:
- Node.js 20+ ([baixar aqui](https://nodejs.org))
- npm (vem com Node.js)

#### Passo 1: Instale as Dependências

```bash
npm install
```

Isso vai baixar todas as bibliotecas necessárias (demora alguns minutos na primeira vez).

#### Passo 2: Configure o Banco de Dados

```bash
npm run seed
```

Isso cria o banco de dados e insere:
- 1 usuário administrador (para acessar o painel)
- 8 categorias de produtos (Processadores, GPUs, etc)
- 6 produtos de exemplo

#### Passo 3: Inicie o Servidor

```bash
npm run dev
```

Abra seu navegador em: **[http://localhost:3000](http://localhost:3000)**

A aplicação está pronta para usar! 🎉

---

## 🐳 Configuração Docker Detalhada

### Pré-requisitos

- Docker 24 ou superior
- Docker Compose v2 (vem com Docker Desktop)

### Quick Start (Rápido)

```bash
# 1. Copie o arquivo de ambiente
cp .env.example .env

# 2. (Opcional) Configure uma senha JWT forte
#    JWT_SECRET=$(openssl rand -base64 32)

# 3. Inicie tudo de uma vez
docker compose up --build

# A aplicação estará em: http://localhost:3000
# O banco de dados é populado automaticamente na primeira execução
```

### Comandos Úteis

```bash
# Iniciar novamente (mais rápido, não recompila)
docker compose up

# Recompilar a imagem (após mudanças no código)
docker compose up --build

# Parar a aplicação (dados preservados)
docker compose down

# Parar E apagar todos os dados (para começar do zero)
docker compose down -v
```

### Popular o Banco de Dados Manualmente (Se Necessário)

```bash
docker compose exec app node_modules/.bin/tsx src/db/seed.ts
```

### Variáveis de Ambiente

| Variável    | Valor Padrão                     | O Que Faz                                |
|-------------|----------------------------------|------------------------------------------|
| `JWT_SECRET`  | `dev-secret-change-in-production`| Chave secreta para encriptar senhas      |
| `DB_DIR`      | `/app/data`                      | Pasta onde o banco de dados é armazenado |

⚠️ **Importante para Produção:** Nunca use o valor padrão de `JWT_SECRET` em produção. Sempre gere uma chave aleatória com `openssl rand -base64 32`.

---

## 🔓 Contas Padrão (Para Teste)

### Usuário Administrador

Você pode acessar o painel de administração com:

| Campo    | Valor                  |
|----------|------------------------|
| **Email**    | `admin@techstore.com`  |
| **Senha**    | `admin1234`            |
| **URL de Login** | `/admin-login`         |

Após fazer login, acesse o painel em: `/admin`

> ⚠️ **NUNCA use essas credenciais em produção!** Sempre mude a senha.

### Conta de Cliente

Para registrar uma nova conta como cliente (comprador):
- Vá para `/cadastro` ou clique em "Cadastrar" na página inicial
- Preencha seus dados
- Pronto! Você pode fazer compras

---

## 📝 Comandos Disponíveis

Use `npm run [comando]` para executar:

| Comando         | O Que Faz                                    |
|-----------------|----------------------------------------------|
| `npm run dev`   | Inicia o servidor de desenvolvimento         |
| `npm run build` | Cria uma versão otimizada para produção      |
| `npm run seed`  | Popula o banco de dados com dados iniciais   |
| `npm test`      | Executa os testes automatizados              |

---

## 📂 Estrutura do Projeto (Para Iniciantes)

Entender onde tudo fica ajuda a navegar o código:

```
src/
  app/                  # Páginas e rotas da aplicação
    [locale]/           # Páginas em diferentes idiomas (en-US, pt-BR)
      admin/            # Painel de admin (protegido por senha)
      login/            # Página de login
      cadastro/         # Página de registro
      produtos/         # Catálogo de produtos
      carrinho/         # Carrinho de compras
      checkout/         # Finalizar compra
      compras/          # Histórico de pedidos
    api/                # Rotas do servidor (endpoints)
      admin/            # API para gerenciar produtos, categorias, etc
      auth/             # API de login/autenticação
      products/         # API de produtos
      orders/           # API de pedidos
  
  components/           # Componentes reutilizáveis (botões, cards, etc)
  context/              # Estado global (autenticação, carrinho)
  db/                   # Configuração do banco de dados SQLite
  hooks/                # Funções para buscar dados
  i18n/                 # Configuração de idiomas (português/inglês)
  lib/                  # Funções auxiliares (JWT, criptografia)

messages/               # Textos em português e inglês
public/                 # Imagens e arquivos estáticos
```

---

## 🚀 Recursos Principais

### Para Clientes
- ✅ Navegar por categorias de produtos
- ✅ Pesquisar produtos
- ✅ Adicionar itens ao carrinho
- ✅ Finalizar compra
- ✅ Ver histórico de pedidos
- ✅ Gerenciar conta e alterar senha
- ✅ Interface em português ou inglês

### Para Administradores
- ✅ Acessar painel de controle
- ✅ Adicionar, editar e deletar produtos
- ✅ Gerenciar categorias
- ✅ Visualizar todos os pedidos
- ✅ Marcar pedidos como atendidos
- ✅ Ver estatísticas

---

## 🔐 Segurança

Este projeto implementa boas práticas de segurança:

- **Senhas:** Criptografadas com bcrypt (impossível recuperar a senha original)
- **Tokens:** Autenticação por JWT (mais seguro que cookies simples)
- **Validação:** Todos os formulários são validados no frontend e backend
- **Admin:** Apenas usuários com role `admin` podem acessar o painel

---

## 📚 Próximos Passos para Aprender

Se você quer aprender desenvolvendo com este projeto:

1. **Explore o código** — Abra `src/app/` e veja como as páginas são estruturadas
2. **Modifique um produto** — Vá para `/admin` e adicione um novo produto
3. **Teste o carrinho** — Adicione produtos e veja o carrinho atualizar em tempo real
4. **Customize o estilo** — Edite `src/components/` para mudar cores e layouts
5. **Leia os comentários** — Procure por comentários no código que explicam partes importantes

---

## 🐛 Encontrou um Problema?

- Veja os logs com: `docker compose logs app` (se usando Docker)
- Verifique se Node.js e npm estão instalados corretamente
- Tente deletar `node_modules` e rodar `npm install` novamente
- Procure por issues no repositório

---

## 📝 Licença

Este projeto é educacional e está disponível para estudar e modificar.

---

**Divirta-se aprendendo! 🎓**
