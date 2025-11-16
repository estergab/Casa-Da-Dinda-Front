export interface Aumigo {
  id: string;
  name: string;
  type: "ong" | "abrigo" | "clinica" | "petshop" | "veterinario";
  description: string;
  city: string;
  state: string;
  phone?: string;
  email?: string;
  website: string;
  imageUrl: string;
}

export const aumigosData: Aumigo[] = [
  {
    id: "1",
    name: "União SRD - São Paulo",
    type: "ong",
    description: "ONG dedicada ao resgate e adoção de animais sem raça definida. Atuamos há mais de 10 anos resgatando, tratando e encontrando lares para cães e gatos abandonados.",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 98765-4321",
    email: "contato@uniaosrd.org.br",
    website: "https://www.uniaosrd.org.br",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
  },
  {
    id: "2",
    name: "Abrigo dos Bichos - RJ",
    type: "abrigo",
    description: "Abrigo que cuida de mais de 300 animais resgatados. Oferecemos castração gratuita e campanhas de adoção todos os finais de semana.",
    city: "Rio de Janeiro",
    state: "RJ",
    phone: "(21) 3456-7890",
    email: "abrigo@dosbichos.org",
    website: "https://www.abrigodosbichos.org.br",
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800",
  },
  {
    id: "3",
    name: "Clínica Veterinária Popular",
    type: "clinica",
    description: "Clínica com atendimento a preços populares. Consultas, vacinas, castrações e cirurgias com valores acessíveis para tutores de baixa renda.",
    city: "Belo Horizonte",
    state: "MG",
    phone: "(31) 2345-6789",
    email: "contato@vetpopular.com.br",
    website: "https://www.clinicavetpopular.com.br",
    imageUrl: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800",
  },
  {
    id: "4",
    name: "Projeto Patinhas Solidárias",
    type: "ong",
    description: "Projeto social que promove feiras de adoção, campanhas de vacinação e conscientização sobre guarda responsável em comunidades carentes.",
    city: "Porto Alegre",
    state: "RS",
    phone: "(51) 99876-5432",
    email: "patinhas@solidarias.org",
    website: "https://www.patinhasksolidarias.org.br",
    imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800",
  },
  {
    id: "5",
    name: "Centro de Zoonoses - Curitiba",
    type: "abrigo",
    description: "Centro municipal que oferece serviços de castração, vacinação antirrábica e orientação sobre saúde animal. Também promove adoções responsáveis.",
    city: "Curitiba",
    state: "PR",
    phone: "(41) 3321-4567",
    email: "zoonoses@curitiba.pr.gov.br",
    website: "https://www.curitiba.pr.gov.br/zoonoses",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
  },
  {
    id: "6",
    name: "Amigos de 4 Patas",
    type: "ong",
    description: "ONG focada no resgate de animais em situação de maus-tratos e abandono. Trabalhamos com lares temporários e adoção consciente.",
    city: "Salvador",
    state: "BA",
    phone: "(71) 98765-1234",
    email: "amigos4patas@gmail.com",
    website: "https://www.amigos4patas.org",
    imageUrl: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800",
  },
  {
    id: "7",
    name: "Vet Social - Recife",
    type: "clinica",
    description: "Veterinários voluntários que atendem gratuitamente animais de tutores em vulnerabilidade social. Atendimento mediante comprovação de renda.",
    city: "Recife",
    state: "PE",
    phone: "(81) 3234-5678",
    email: "vetsocial@recife.pe.gov.br",
    website: "https://www.vetsocialrecife.com.br",
    imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800",
  },
  {
    id: "8",
    name: "Anjos Peludos - Brasília",
    type: "ong",
    description: "Resgatamos e cuidamos de animais idosos e com deficiência. Buscamos lares especiais que possam dar amor e cuidados a esses anjinhos.",
    city: "Brasília",
    state: "DF",
    phone: "(61) 99123-4567",
    email: "anjospeludos@brasilia.df.gov.br",
    website: "https://www.anjospeludos.org.br",
    imageUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800",
  },
];
