# 🏠 Casa da Dinda - Frontend

## 📖 Sobre

Interface web para a plataforma Casa da Dinda, permitindo que usuários cadastrem lares temporários para pets e solicitem estadias. Desenvolvida com React, TypeScript e TailwindCSS.

### 🚀 Status
**MVP (Minimum Viable Product)** - Em desenvolvimento

---

## 🛠️ Tecnologias

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation

---

## 🏗️ Estrutura de Pastas

frontend/
├── src/
│ ├── components/
│ │ └── ui/ # Componentes shadcn/ui
│ ├── pages/ # Páginas da aplicação
│ ├── App.tsx # Roteamento principal
│ ├── main.tsx # Entry point
│ └── index.css # Estilos globais
├── public/ # Arquivos estáticos
├── package.json
├── vite.config.ts
└── tailwind.config.js

text

---

## 🚀 Instalação

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn

### **1. Instalar Dependências**
cd frontend
npm install

text

### **2. Executar em Desenvolvimento**
npm run dev

text

O frontend estará rodando em `http://localhost:8080`

### **3. Build para Produção**
npm run build

text

### **4. Preview da Build**
npm run preview

text

---

## 🎨 Páginas

### **Públicas**
1. **Index** (`/`) - Página inicial com apresentação do projeto
2. **HomesList** (`/lares`) - Lista de lares disponíveis com filtros
3. **HomeDetails** (`/lar/:id`) - Detalhes completos de um lar específico
4. **RegisterHome** (`/cadastrar`) - Formulário de cadastro de anfitrião

### **Solicitações**
5. **RequestStay** (`/solicitar/:homeId`) - Formulário para solicitar estadia
6. **SolicitacoesLogin** (`/solicitacoes`) - Login para visualizar solicitações
7. **SolicitacoesList** (`/solicitacoes/:email`) - Lista de solicitações do usuário
8. **SolicitacoesDetalhes** (`/solicitacao/:id`) - Detalhes e ações da solicitação

### **Gerenciamento**
9. **EditHome** (`/editar/:id`) - Edição de lar cadastrado

### **Futuras**
10. **AumigosList** (`/aumigos`) - Lista de pets cadastrados (em planejamento)

---

## ✨ Funcionalidades

### **Implementadas**
- ✅ Cadastro de lares temporários com upload de fotos
- ✅ Listagem e busca de lares por localização
- ✅ Filtros por tipo de pet (Cães, Gatos, Filhotes, Grande Porte)
- ✅ Solicitação de estadia com informações do pet
- ✅ Upload de imagens (lares e pets)
- ✅ Sistema de status para solicitações (pendente/aceita/negada)
- ✅ Validação de formulários com React Hook Form + Zod
- ✅ Interface responsiva mobile-first
- ✅ Componentes reutilizáveis com shadcn/ui

### **Componentes shadcn/ui Utilizados**
- Button
- Input
- Select
- Card
- Form
- Label
- Checkbox
- Textarea

---

## 🔌 Integração com Backend

A aplicação consome a API REST do backend através de:

**Base URL:** `http://localhost:5000/api`

### **Endpoints Consumidos**
- `GET /lares` - Listar lares
- `GET /lares/:id` - Detalhes do lar
- `POST /lares` - Cadastrar lar
- `PUT /lares/:id` - Atualizar lar
- `POST /solicitacoes` - Criar solicitação
- `GET /solicitacoes/email/:email` - Solicitações do usuário
- `PATCH /solicitacoes/:id/aceitar` - Aceitar solicitação
- `PATCH /solicitacoes/:id/negar` - Negar solicitação

---

## 🎯 Fluxo de Usuário

### **Anfitrião (Quem oferece o lar)**
1. Acessa `/cadastrar`
2. Preenche formulário com dados do lar
3. Faz upload de foto do espaço
4. Lar aparece na listagem `/lares`
5. Recebe solicitações em `/solicitacoes/:email`
6. Aceita ou nega solicitações

### **Tutor (Quem busca lar temporário)**
1. Acessa `/lares` e filtra por localização/tipo de pet
2. Visualiza detalhes em `/lar/:id`
3. Clica em "Solicitar Estadia"
4. Preenche formulário em `/solicitar/:homeId`
5. Faz upload de foto do pet
6. Acompanha status em `/solicitacoes/:email`

---

## 🚧 Próximas Funcionalidades

- [ ] Autenticação de usuários (JWT)
- [ ] Perfil de usuário editável
- [ ] Sistema de notificações em tempo real
- [ ] Chat entre tutor e anfitrião
- [ ] Sistema de avaliações
- [ ] Dashboard administrativo
- [ ] Página "Aumigos" (pets cadastrados)
- [ ] Histórico de estadias

---

## 🎨 Customização

### **Cores (TailwindCSS)**
As cores principais podem ser ajustadas em `tailwind.config.js`:
theme: {
extend: {
colors: {
primary: {...},
secondary: {...}
}
}
}

text

### **Componentes shadcn/ui**
Para adicionar novos componentes:
npx shadcn-ui@latest add [component-name]

text

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

MIT License - Veja o arquivo `LICENSE` para detalhes

---

## 📞 Suporte

Para dúvidas e suporte, abra uma issue no GitHub