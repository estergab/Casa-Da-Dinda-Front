import { z } from "zod";

// Schema para cadastro de lar temporário
export const registerHomeSchema = z.object({
  // Informações Pessoais
  hostName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido").max(255, "E-mail muito longo"),
  phone: z.string().min(10, "Telefone inválido").max(20, "Telefone muito longo"),
  
  // Endereço
  address: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres").max(200, "Endereço muito longo"),
  city: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres").max(100, "Cidade muito longa"),
  state: z.string().length(2, "Estado deve ter 2 caracteres").toUpperCase(),
  
  // Detalhes do Lar
  capacity: z.number().min(1, "Capacidade deve ser no mínimo 1").max(20, "Capacidade máxima de 20 pets"),
  hasYard: z.boolean().optional(),
  hasFence: z.boolean().optional(),
  acceptsDogs: z.boolean().optional(),
  acceptsCats: z.boolean().optional(),
  acceptsLargeDogs: z.boolean().optional(),
  acceptsPuppies: z.boolean().optional(),
  experience: z.string().max(1000, "Texto muito longo").optional(),
  description: z.string().max(1000, "Texto muito longo").optional(),
});

export type RegisterHomeFormData = z.infer<typeof registerHomeSchema>;

// Schema para solicitação de estadia
export const requestStaySchema = z.object({
  // Informações do Tutor
  requesterName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome muito longo"),
  requesterEmail: z.string().email("E-mail inválido").max(255, "E-mail muito longo"),
  requesterPhone: z.string().min(10, "Telefone inválido").max(20, "Telefone muito longo"),
  
  // Informações do Pet
  petName: z.string().min(2, "Nome do pet deve ter no mínimo 2 caracteres").max(50, "Nome muito longo"),
  petType: z.enum(["dog", "cat"], { required_error: "Selecione o tipo de animal" }),
  petAge: z.string().max(50, "Texto muito longo").optional(),
  petSize: z.string().max(50, "Texto muito longo").optional(),
  healthConditions: z.string().max(1000, "Texto muito longo").optional(),
  behavior: z.string().max(1000, "Texto muito longo").optional(),
  
  // Detalhes da Estadia
  startDate: z.string().optional(),
  duration: z.string().max(100, "Texto muito longo").optional(),
  message: z.string().max(1000, "Mensagem muito longa").optional(),
  
  // ID do lar
  homeId: z.string(),
});

export type RequestStayFormData = z.infer<typeof requestStaySchema>;
