import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { z } from "zod";

const requestSchema = z.object({
  requesterName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  requesterEmail: z.string().email("E-mail inválido"),
  requesterPhone: z.string().min(10, "Telefone inválido"),
  petName: z.string().min(2, "Nome do pet inválido"),
  petType: z.enum(["dog", "cat"], { required_error: "Selecione o tipo do pet" }),
  petAge: z.string().optional(),
  petSize: z.string().optional(),
  healthConditions: z.string().optional(),
  behavior: z.string().optional(),
  startDate: z.string().optional(),
  duration: z.string().optional(),
  message: z.string().optional(),
  petImage: z.instanceof(File).optional(),
});

type RequestForm = z.infer<typeof requestSchema>;

interface Home {
  _id: string;
  hostName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  imageUrl?: string;
}

const RequestStay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [home, setHome] = useState<Home | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      petType: undefined,
    },
  });

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await api.get(`/lares/${id}`);
        setHome(response.data.data || response.data);
      } catch (error) {
        console.error("Erro ao buscar lar:", error);
        toast.error("Erro ao carregar informações do lar");
        navigate("/lares");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchHome();
  }, [id, navigate]);

  const onSubmit = async (data: RequestForm) => {
    if (!home) return;

    try {
      const formData = new FormData();
      formData.append("homeId", home._id);
      formData.append("hostEmail", home.email);
      formData.append("requesterName", data.requesterName);
      formData.append("requesterEmail", data.requesterEmail.toLowerCase());
      formData.append("requesterPhone", data.requesterPhone);
      formData.append("petName", data.petName);
      formData.append("petType", data.petType);

      if (data.petAge) formData.append("petAge", data.petAge);
      if (data.petSize) formData.append("petSize", data.petSize);
      if (data.healthConditions) formData.append("healthConditions", data.healthConditions);
      if (data.behavior) formData.append("behavior", data.behavior);
      if (data.startDate) formData.append("startDate", data.startDate);
      if (data.duration) formData.append("duration", data.duration);
      if (data.message) formData.append("message", data.message);
      if (data.petImage) formData.append("petImage", data.petImage);

      const response = await api.post("/solicitacoes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Solicitação enviada com sucesso!");
      setTimeout(() => navigate("/lares"), 1500);
    } catch (error: any) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error(error.response?.data?.message || "Erro ao enviar solicitação");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Carregando...</p>
        </div>
      </>
    );
  }

  if (!home) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Lar não encontrado</p>
          <Button onClick={() => navigate("/lares")} className="mt-4">
            Voltar para listagem
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* ✅ BOTÃO VOLTAR MOVIDO PARA DENTRO DO CONTAINER */}
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {/* Informações do Lar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lar Temporário</CardTitle>
            <CardDescription>
              {home.hostName} - {home.city}/{home.state}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Formulário de Solicitação */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Hospedagem</CardTitle>
            <CardDescription>
              Preencha as informações sobre você e seu pet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Suas Informações */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Suas Informações</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="requesterName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requesterEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requesterPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone *</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Informações do Pet */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informações do Pet</h3>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="petName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Pet *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do seu pet" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="petType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Pet *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dog" id="dog" />
                                <Label htmlFor="dog">Cão</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cat" id="cat" />
                                <Label htmlFor="cat">Gato</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="petAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Idade</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 2 anos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="petSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Porte</FormLabel>
                            <FormControl>
                              <Input placeholder="Pequeno, Médio ou Grande" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="healthConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condições de Saúde</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Alguma condição de saúde especial?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="behavior"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comportamento</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o comportamento do seu pet"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Início</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duração Estimada</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 2 semanas" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensagem Adicional</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Alguma informação adicional que gostaria de compartilhar?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Upload de Foto do Pet */}
                    <FormField
                      control={form.control}
                      name="petImage"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <FormLabel>Foto do Pet (Opcional)</FormLabel>
                          <FormControl>
                            <>
                              <div
                                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 transition-colors"
                                onClick={() => document.getElementById('petImageUpload')?.click()}
                              >
                                {imagePreview ? (
                                  <img
                                    src={imagePreview}
                                    alt="Preview do pet"
                                    className="mx-auto max-h-48 rounded"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center gap-2 text-gray-500">
                                    <Upload className="h-8 w-8" />
                                    <p className="text-sm">Clique para fazer upload</p>
                                  </div>
                                )}
                              </div>
                              <input
                                id="petImageUpload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    onChange(file);
                                    setImagePreview(URL.createObjectURL(file));
                                  }
                                }}
                                {...field}
                              />
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RequestStay;
