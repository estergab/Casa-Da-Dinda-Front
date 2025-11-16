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
import { getUploadUrl } from "@/config/api"; // ✅ ADICIONAR
import * as z from "zod";

const requestStaySchema = z.object({
  requesterName: z.string().min(1, "Nome é obrigatório"),
  requesterEmail: z.string().email("Email inválido"),
  requesterPhone: z.string().min(10, "Telefone inválido"),
  petName: z.string().min(1, "Nome do pet é obrigatório"),
  petType: z.enum(["dog", "cat"], { required_error: "Selecione o tipo de pet" }),
  petAge: z.string().optional(),
  petSize: z.string().optional(),
  healthConditions: z.string().optional(),
  behavior: z.string().optional(),
  startDate: z.string().optional(),
  duration: z.string().optional(),
  message: z.string().optional(),
  petImage: z.instanceof(File).optional(),
});

type RequestStayFormData = z.infer<typeof requestStaySchema>;

const RequestStay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [home, setHome] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isNewTutor, setIsNewTutor] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<RequestStayFormData | null>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);

  const form = useForm<RequestStayFormData>({
    resolver: zodResolver(requestStaySchema),
    defaultValues: {
      requesterName: "",
      requesterEmail: "",
      requesterPhone: "",
      petName: "",
      petType: "dog",
      petAge: "",
      petSize: "",
      healthConditions: "",
      behavior: "",
      startDate: "",
      duration: "",
      message: "",
    },
  });

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await api.get(`/lares/${id}`);
        const larData = response.data.data || response.data;
        setHome(larData);
      } catch (error) {
        console.error("Erro ao buscar lar:", error);
        toast.error("Erro ao carregar informações do lar");
      }
    };

    if (id) fetchHome();
  }, [id]);

  const handleEmailBlur = async () => {
    const email = form.getValues("requesterEmail");
    if (!email) return;

    try {
      const response = await api.get(`/solicitacoes/check-tutor-email/${email.toLowerCase()}`);
      if (response.data.exists) {
        setIsNewTutor(false);
      } else {
        setIsNewTutor(true);
      }
    } catch (error) {
      console.error("Erro ao verificar email:", error);
    }
  };

  const onSubmit = async (data: RequestStayFormData) => {
    console.log("✅ FORMULÁRIO VÁLIDO! Abrindo modal de senha...");
    setPendingFormData(data);
    setPendingImage(data.petImage || null);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    if (!pendingFormData) return;

    if (isNewTutor) {
      if (password.length < 6) {
        toast.error("A senha deve ter no mínimo 6 caracteres");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }
    } else {
      try {
        const authResponse = await api.post('/solicitacoes/authenticate-tutor', {
          email: pendingFormData.requesterEmail.toLowerCase(),
          password: password
        });

        if (!authResponse.data.success) {
          toast.error("Senha incorreta");
          return;
        }

        toast.success("Autenticação bem-sucedida! Criando solicitação...");
      } catch (error: any) {
        console.error("Erro na autenticação:", error);
        toast.error(error.response?.data?.message || "Senha incorreta");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("homeId", id || "");
      formData.append("requesterName", pendingFormData.requesterName);
      formData.append("requesterEmail", pendingFormData.requesterEmail.toLowerCase());
      formData.append("requesterPassword", password);
      formData.append("requesterPhone", pendingFormData.requesterPhone);
      formData.append("petName", pendingFormData.petName);
      formData.append("petType", pendingFormData.petType);

      if (pendingFormData.petAge) formData.append("petAge", pendingFormData.petAge);
      if (pendingFormData.petSize) formData.append("petSize", pendingFormData.petSize);
      if (pendingFormData.healthConditions) formData.append("healthConditions", pendingFormData.healthConditions);
      if (pendingFormData.behavior) formData.append("behavior", pendingFormData.behavior);
      if (pendingFormData.startDate) formData.append("startDate", pendingFormData.startDate);
      if (pendingFormData.duration) formData.append("duration", pendingFormData.duration);
      if (pendingFormData.message) formData.append("message", pendingFormData.message);

      if (pendingImage) {
        formData.append("petImage", pendingImage);
      }

      const response = await api.post("/solicitacoes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Solicitação criada:", response.data);
      toast.success("Solicitação enviada com sucesso!");
      setShowPasswordModal(false);
      setTimeout(() => navigate("/solicitacoes-login"), 1200);
    } catch (error: any) {
      console.error("❌ Erro ao enviar solicitação:", error);
      toast.error(error.response?.data?.message || "Erro ao enviar solicitação");
    }
  };

  if (!home) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Carregando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <p className="text-sm text-gray-600">Lar Temporário</p>
            <CardTitle>{home.hostName} - {home.city}/{home.state}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solicitar Hospedagem</CardTitle>
            <CardDescription>Preencha as informações sobre você e seu pet.</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Suas Informações */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Suas Informações</h3>
                  <div className="grid gap-4 md:grid-cols-2">
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
                            <Input
                              type="email"
                              placeholder="seu@email.com"
                              {...field}
                              onBlur={() => {
                                field.onBlur();
                                handleEmailBlur();
                              }}
                            />
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
                              defaultValue={field.value}
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

                    <div className="grid gap-4 md:grid-cols-2">
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
                              rows={3}
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
                              placeholder="Como é o comportamento do seu pet?"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="petImage"
                      render={({ field: { onChange, value, ...restField } }) => (
                        <FormItem>
                          <FormLabel>Foto do Pet</FormLabel>
                          <FormControl>
                            <>
                              <div
                                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                                onClick={() => document.getElementById('petImageUpload')?.click()}
                              >
                                {imagePreview ? (
                                  <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mx-auto max-h-48 rounded"
                                  />
                                ) : (
                                  <div className="space-y-2">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="text-sm text-gray-600">Clique para fazer upload</p>
                                  </div>
                                )}
                              </div>
                              <input
                                id="petImageUpload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    onChange(file);
                                    setImagePreview(URL.createObjectURL(file));
                                  }
                                }}
                              />
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Detalhes da Estadia */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Detalhes da Estadia</h3>
                  <div className="grid gap-4 md:grid-cols-2">
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
                          <FormLabel>Duração</FormLabel>
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
                      <FormItem className="mt-4">
                        <FormLabel>Mensagem Adicional</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Alguma informação adicional que gostaria de compartilhar?"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Enviando..." : "Continuar"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Senha */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewTutor ? "Criar Senha" : "Digite sua Senha"}</DialogTitle>
            <DialogDescription>
              {isNewTutor
                ? "Como esta é sua primeira solicitação, crie uma senha para gerenciar suas hospedagens."
                : "Você já possui solicitações. Digite sua senha para enviar uma nova solicitação."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {isNewTutor && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordSubmit}>
              {isNewTutor ? "Enviar Solicitação" : "Autenticar e Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestStay;

