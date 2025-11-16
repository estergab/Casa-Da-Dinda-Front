export interface TemporaryHome {
  id: string;
  hostName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  capacity: number;
  hasYard: boolean;
  hasFence: boolean;
  experience: string;
  availableFor: string[];
  description: string;
  imageUrl: string;
  createdAt: Date;
}

// Mock data for temporary homes
export const mockHomes: TemporaryHome[] = [
  {
    id: "1",
    hostName: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 98765-4321",
    city: "São Paulo",
    state: "SP",
    address: "Rua das Flores, 123",
    capacity: 2,
    hasYard: true,
    hasFence: true,
    experience: "Tenho experiência com cães de grande porte e já acolhi 5 pets resgatados nos últimos 2 anos.",
    availableFor: ["Cães", "Gatos"],
    description: "Casa espaçosa com quintal cercado, ideal para pets que precisam de espaço. Trabalho home office, então posso dedicar atenção durante todo o dia.",
    imageUrl: "/placeholder.svg",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    hostName: "João Santos",
    email: "joao.santos@email.com",
    phone: "(21) 97654-3210",
    city: "Rio de Janeiro",
    state: "RJ",
    address: "Avenida Atlântica, 456",
    capacity: 1,
    hasYard: false,
    hasFence: false,
    experience: "Adotei meu primeiro gato há 3 anos e desde então ajudo com lares temporários para felinos.",
    availableFor: ["Gatos"],
    description: "Apartamento tranquilo e seguro, perfeito para gatos. Tenho experiência com felinos tímidos e que precisam de adaptação.",
    imageUrl: "/placeholder.svg",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    hostName: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(31) 96543-2109",
    city: "Belo Horizonte",
    state: "MG",
    address: "Rua das Acácias, 789",
    capacity: 3,
    hasYard: true,
    hasFence: true,
    experience: "Voluntária em ONG de proteção animal há 5 anos. Já cuidei de mais de 20 cães resgatados.",
    availableFor: ["Cães", "Cães de Grande Porte"],
    description: "Casa com amplo quintal cercado e estrutura completa para receber cães de todos os portes. Experiência com reabilitação comportamental.",
    imageUrl: "/placeholder.svg",
    createdAt: new Date("2024-03-10"),
  },
];

// Mock data para usuários (tutores e anfitriões)
export interface Usuario {
  email: string;
  nome: string;
  tipo: "tutor" | "anfitriao";
  telefone: string;
}

export const mockUsuarios: Usuario[] = [
  { email: "maria.silva@email.com", nome: "Maria Silva", tipo: "anfitriao", telefone: "(11) 98765-4321" },
  { email: "joao.santos@email.com", nome: "João Santos", tipo: "anfitriao", telefone: "(21) 97654-3210" },
  { email: "ana.costa@email.com", nome: "Ana Costa", tipo: "anfitriao", telefone: "(31) 96543-2109" },
  { email: "carlos.tutor@email.com", nome: "Carlos Oliveira", tipo: "tutor", telefone: "(11) 99876-5432" },
  { email: "lucia.tutor@email.com", nome: "Lúcia Ferreira", tipo: "tutor", telefone: "(21) 98765-4321" },
];

// Mock data para solicitações
export interface Solicitacao {
  id: string;
  petNome: string;
  petIdade: string;
  petPorte: string;
  petComportamento: string;
  status: "pendente" | "aceita" | "recusada" | "finalizada";
  tutorEmail: string;
  tutorNome: string;
  tutorTelefone: string;
  anfitriaoEmail: string;
  anfitriaoNome: string;
  anfitriaoTelefone: string;
  anfitriaoEndereco: string;
  mensagem: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export const mockSolicitacoes: Solicitacao[] = [
  {
    id: "1",
    petNome: "Thor",
    petIdade: "3 anos",
    petPorte: "Grande",
    petComportamento: "Dócil, brincalhão, mas precisa de espaço",
    status: "pendente",
    tutorEmail: "carlos.tutor@email.com",
    tutorNome: "Carlos Oliveira",
    tutorTelefone: "(11) 99876-5432",
    anfitriaoEmail: "maria.silva@email.com",
    anfitriaoNome: "Maria Silva",
    anfitriaoTelefone: "(11) 98765-4321",
    anfitriaoEndereco: "Rua das Flores, 123 - São Paulo/SP",
    mensagem: "Olá! Resgatei o Thor recentemente e preciso de um lar temporário enquanto trato sua documentação de adoção. Ele é muito carinhoso!",
    dataCriacao: new Date("2024-03-15"),
    dataAtualizacao: new Date("2024-03-15"),
  },
  {
    id: "2",
    petNome: "Luna",
    petIdade: "2 anos",
    petPorte: "Pequeno",
    petComportamento: "Calma, tímida, precisa de paciência",
    status: "aceita",
    tutorEmail: "lucia.tutor@email.com",
    tutorNome: "Lúcia Ferreira",
    tutorTelefone: "(21) 98765-4321",
    anfitriaoEmail: "joao.santos@email.com",
    anfitriaoNome: "João Santos",
    anfitriaoTelefone: "(21) 97654-3210",
    anfitriaoEndereco: "Avenida Atlântica, 456 - Rio de Janeiro/RJ",
    mensagem: "Luna foi abandonada e está muito assustada. Preciso de alguém com experiência para ajudá-la a se adaptar.",
    dataCriacao: new Date("2024-03-10"),
    dataAtualizacao: new Date("2024-03-12"),
  },
  {
    id: "3",
    petNome: "Bolinha",
    petIdade: "5 anos",
    petPorte: "Médio",
    petComportamento: "Protetor, leal, já tem treino básico",
    status: "finalizada",
    tutorEmail: "carlos.tutor@email.com",
    tutorNome: "Carlos Oliveira",
    tutorTelefone: "(11) 99876-5432",
    anfitriaoEmail: "ana.costa@email.com",
    anfitriaoNome: "Ana Costa",
    anfitriaoTelefone: "(31) 96543-2109",
    anfitriaoEndereco: "Rua das Acácias, 789 - Belo Horizonte/MG",
    mensagem: "Bolinha já foi adotado! Muito obrigado pelo cuidado e carinho durante todo esse tempo.",
    dataCriacao: new Date("2024-02-01"),
    dataAtualizacao: new Date("2024-03-01"),
  },
];
