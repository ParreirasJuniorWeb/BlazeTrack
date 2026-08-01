# ⚡ BlazeTrack — Gestão & Monitoramento de Tarefas Colaborativas

O **BlazeTrack** é um ecossistema inteligente de alta performance voltado para a gestão, rastreamento e monitoramento operacional de demandas. Desenvolvido com uma abordagem arquitetural de nível corporativo utilizando **Next.js 14+ (App Router)**, **Redux Toolkit** e **Firebase**, o projeto simula funcionalidades avançadas de plataformas líderes de mercado (como Monday.com e Linear), incorporando metodologias de foco como o **Pomodoro** e quadros operacionais **Kanban** em tempo real.

---

## 🛠️ Stack Tecnológica & Decisões Arquiteturais

O projeto foi estruturado sob o conceito de **Feature-Folder Architecture** combinado com princípios de **Clean Architecture**, isolando completamente as regras de infraestrutura da camada de apresentação visual.

*   **Next.js (App Router):** Utilizado para otimização de performance nativa, divisão estratégica entre *Server Components* (carregamento inicial instantâneo e SEO) e *Client Components* (interatividades ricas).
*   **TypeScript:** Tipagem estrita de ponta a ponta, eliminando erros em tempo de compilação e garantindo contratos de dados previsíveis através de utilitários como `Omit`, `Partial` e `Pick`.
*   **Redux Toolkit (RTK):** Centralização do estado global com gerenciamento assíncrono avançado via `createAsyncThunk` e otimização de re-renderizações com seletores memorizados.
*   **Tailwind CSS:** Construção de uma interface *Premium Dark Mode* responsiva e de alta fidelidade visual sem injeção de dependências de estilos pesadas.
*   **Firebase (Auth & Firestore):** Persistência NoSQL distribuída e autenticação híbrida (E-mail/Senha + OAuth Social com Google e GitHub) integrada com listeners em tempo real (`onSnapshot`).
*   **Zod & React Hook Form:** Validação robusta de esquemas de formulários no *front-end* com inferência direta de tipos no TypeScript.

---

## ⚙️ Arquitetura de Pastas (Maturidade de Software)

A engenharia do diretório foi desenhada para garantir escalabilidade horizontal sem acoplamento de código:

```text
src/
├── app/                        # Roteamento baseado em arquivos (App Router)
│   ├── (auth)/                 # Escopo de rotas públicas de autenticação
│   ├── (dashboard)/            # Escopo de rotas privadas protegidas por Middleware
│   └── tasks/[id]/             # Rota dinâmica real-time para detalhes da tarefa
├── components/                 # Componentes compartilhados e agnósticos (UI/Design System)
├── config/                     # Inicialização isolada de SDKs de terceiros (Firebase)
├── features/                   # Domínios de Negócio Isolados (Core do App)
│   ├── auth/                   # Módulo de Autenticação (Slices, Services, Components)
│   └── tasks/                  # Módulo de Tarefas & Kanban (Slices, Services, Components)
├── store/                      # Configuração global, hooks tipados e Provider do Redux
└── utils/                      # Funções utilitárias puras e helpers
```

---

## 🔒 Segurança Extrema no Client & Server

Para mitigar vulnerabilidades comuns, a segurança do BlazeTrack foi implementada de maneira multicamadas:
1.  **Borda (Edge Runtime):** Um `middleware.ts` nativo intercepta requisições HTTP e valida cookies de sessão antes que qualquer HTML privado seja renderizado no navegador.
2.  **Camada de Aplicação (Hydration):** Um observer global `onAuthStateChanged` reidrata a store do Redux automaticamente e expurga lixos de memória e tokens corrompidos.
3.  **Camada do Servidor (NoSQL Rules):** O arquivo `firestore.rules` blinda o banco de dados contra mutações maliciosas diretamente na API do Firebase. Usuários terceiros conseguem apenas anexar comentários em tarefas públicas, sendo sumariamente bloqueados se tentarem alterar títulos, descrições ou status de demandas alheias.

---

## 🚀 Como Inicializar o Projeto Localmente

### 1. Clonar o Repositório e Instalar as Dependências
```bash
git clone https://github.com
cd blazetrack
npm install
```

### 2. Configurar as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto e insira as suas credenciais do console do Firebase:
```text
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_://firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_://appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 3. Sincronizar Regras e Índices do Firestore (Firebase CLI)
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore
```

### 4. Executar o Servidor de Desenvolvimento
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador para operar a plataforma.
