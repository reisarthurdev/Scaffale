# Scaffale

Diário de leituras pessoal. Pesquise livros, organize sua estante e registre suas impressões.

🔗 **[scaffalearthur.vercel.app](https://scaffalearthur.vercel.app)**

---

## Tecnologias

**Frontend**
- React + Vite
- Tailwind CSS
- React Router DOM
- Axios

**Backend**
- Node.js + Express
- PostgreSQL
- JWT (autenticação)
- Bcrypt (criptografia de senhas)

**APIs externas**
- [Open Library API](https://openlibrary.org/developers/api) — base de dados de livros

**Hospedagem**
- Frontend: [Vercel](https://vercel.com)
- Backend + Banco de dados: [Railway](https://railway.app)

---

## Funcionalidades

- Cadastro e login com email e senha
- Recuperação de senha por token
- Edição de perfil (nome e avatar)
- Exclusão de conta
- Busca de livros via Open Library API
- Salvar livros na estante pessoal
- Atualizar status do livro (Quero ler, Lendo, Lido)
- Avaliação por estrelas (1 a 5)
- Anotações por livro
- Tema claro e escuro

---

## Estrutura do projeto

```
scaffale/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── middlewares/
│   │   │   └── auth.js
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── users.js
│   │       ├── books.js
│   │       └── search.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── BookCard.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── MyBooks.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   └── Profile.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## Rodando localmente

**Pré-requisitos**
- Node.js
- PostgreSQL

**1. Clone o repositório**
```bash
git clone https://github.com/SEU_USUARIO/scaffale.git
cd scaffale
```

**2. Configure o backend**
```bash
cd backend
npm install
```

Crie o arquivo `.env`:
```
PORT=3001
DATABASE_URL=postgresql://postgres:suasenha@localhost:5432/booklog
JWT_SECRET=sua_frase_secreta
NODE_ENV=development
```

**3. Crie o banco de dados**
```bash
sudo systemctl start postgresql
sudo -u postgres psql
```

```sql
CREATE DATABASE booklog;
\c booklog

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  avatar_url VARCHAR(1000),
  reset_token VARCHAR(200),
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  open_library_id VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(500),
  cover_url VARCHAR(1000),
  status VARCHAR(20) DEFAULT 'want_to_read',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

\q
```

**4. Inicie o backend**
```bash
npm run dev
```

**5. Configure o frontend**
```bash
cd ../frontend
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

---

## Deploy

**Backend — Railway**
- Conecte o repositório no [Railway](https://railway.app)
- Defina o Root Directory como `backend`
- Adicione as variáveis de ambiente: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`
- Adicione um serviço PostgreSQL e rode as migrations pelo psql

**Frontend — Vercel**
- Conecte o repositório no [Vercel](https://vercel.com)
- Defina o Root Directory como `frontend`
- Adicione a variável: `VITE_API_URL=https://seu-backend.up.railway.app/api`

---

## Endpoints da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/register` | Cadastro | — |
| POST | `/api/auth/login` | Login | — |
| POST | `/api/auth/forgot-password` | Gerar token de recuperação | — |
| POST | `/api/auth/reset-password` | Redefinir senha | — |
| GET | `/api/users/me` | Ver perfil | ✓ |
| PATCH | `/api/users/me` | Editar perfil | ✓ |
| DELETE | `/api/users/me` | Excluir conta | ✓ |
| GET | `/api/books` | Listar livros da estante | ✓ |
| POST | `/api/books` | Salvar livro | ✓ |
| PATCH | `/api/books/:id` | Atualizar livro | ✓ |
| DELETE | `/api/books/:id` | Remover livro | ✓ |
| GET | `/api/search?q=` | Buscar livros na Open Library | ✓ |

---

*Feito com ⚽︎ no Brasil*
