import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Home, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/api";

const registerHomeSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(5, "Endereço inválido"),
  city: z.string().min(2, "Cidade inválida"),
  state: z.string().length(2, "Estado deve ter 2 letras").transform((s) => s.toUpperCase()),
  capacity: z.coerce.number().min(1, "Mínimo 1 pet").max(20, "Máximo 20 pets"),
  hasYard: z.boolean().optional(),
  hasFence: z.boolean().optional(),
  acceptsDogs: z.boolean().optional(),
  acceptsCats: z.boolean().optional(),
  acceptsLargeDogs: z.boolean().optional(),
  acceptsPuppies: z.boolean().optional(),
  experience: z.string().optional(),
  description: z.string().optional(),
  image: z.instanceof(File, { message: "Imagem é obrigatória" }),
});

type RegisterHomeForm = z.infer<typeof registerHomeSchema>;

const RegisterHome: React.FC = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<RegisterHomeForm | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm<RegisterHomeForm>({
    resolver: zodResolver(registerHomeSchema),
    mode: "onSubmit",
  });

  const onInvalid = (errors: any) => {
    console.error("❌ ERROS DE VALIDAÇÃO:", errors);
    toast.error("Por favor, preencha todos os campos obrigatórios");
  };

  const handleEmailBlur = async () => {
    const email = getValues("email");
    if (!email) return;

    try {
      const response = await api.get(`/lares/check-email/${email.toLowerCase()}`);
      if (response.data.exists) {
        setIsNewUser(false);
      } else {
        setIsNewUser(true);
      }
    } catch (error) {
      console.error("Erro ao verificar email:", error);
    }
  };

  const onSubmit = async (data: RegisterHomeForm) => {
    console.log("✅ FORMULÁRIO VÁLIDO! Abrindo modal de senha...");
    setPendingFormData(data);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    if (!pendingFormData) return;

    if (isNewUser) {
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
        const authResponse = await api.post('/lares/authenticate', {
          email: pendingFormData.email.toLowerCase(),
          password: password
        });

        if (!authResponse.data.success) {
          toast.error("Senha incorreta");
          return;
        }
        toast.success("Autenticação bem-sucedida! Criando novo lar...");
      } catch (error: any) {
        console.error("Erro na autenticação:", error);
        toast.error(error.response?.data?.message || "Senha incorreta");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("hostName", pendingFormData.name);
      formData.append("email", pendingFormData.email.toLowerCase());
      formData.append("password", password);
      formData.append("phone", pendingFormData.phone);
      formData.append("address", pendingFormData.address);
      formData.append("city", pendingFormData.city);
      formData.append("state", pendingFormData.state);
      formData.append("capacity", String(pendingFormData.capacity));
      formData.append("hasYard", String(Boolean(pendingFormData.hasYard)));
      formData.append("hasFence", String(Boolean(pendingFormData.hasFence)));

      if (pendingFormData.experience) formData.append("experience", pendingFormData.experience);
      if (pendingFormData.description) formData.append("description", pendingFormData.description);

      const availableFor: string[] = [];
      if (pendingFormData.acceptsDogs) availableFor.push("Cães");
      if (pendingFormData.acceptsCats) availableFor.push("Gatos");
      if (pendingFormData.acceptsLargeDogs) availableFor.push("Cães de Grande Porte");
      if (pendingFormData.acceptsPuppies) availableFor.push("Filhotes");

      availableFor.forEach((item) => {
        formData.append("availableFor", item);
      });

      formData.append("image", pendingFormData.image);

      const response = await api.post("/lares", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Sucesso! Resposta:", response.data);
      toast.success("Lar cadastrado com sucesso!");
      setShowPasswordModal(false);
      setTimeout(() => navigate("/lares"), 1200);
      reset();
      setImagePreview(null);
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("❌ Erro:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        "Erro ao cadastrar. Tente novamente.";
      toast.error(errorMessage);
    }
  };

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

        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Lar Temporário</CardTitle>
            <CardDescription>
              Preencha as informações para oferecer um lar temporário.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
              {/* Informações Pessoais */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Suas Informações</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Seu nome completo"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      onBlur={handleEmailBlur}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="(00) 00000-0000"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Endereço</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Endereço *</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      placeholder="Rua, número, bairro"
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input id="city" {...register("city")} placeholder="Cidade" />
                    {errors.city && (
                      <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      {...register("state")}
                      placeholder="SP"
                      maxLength={2}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sobre o Lar */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sobre o Lar</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="capacity">Capacidade (pets) *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      {...register("capacity")}
                      placeholder="1"
                      min="1"
                      max="20"
                    />
                    {errors.capacity && (
                      <p className="text-sm text-red-500 mt-1">{errors.capacity.message}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-base font-medium">Características</Label>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Controller
                          name="hasYard"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label className="font-normal">Possui quintal</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Controller
                          name="hasFence"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label className="font-normal">Quintal cercado</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Aceita</Label>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Controller
                          name="acceptsDogs"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label className="font-normal">Cães</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Controller
                          name="acceptsCats"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label className="font-normal">Gatos</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Controller
                          name="acceptsLargeDogs"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label className="font-normal">Cães de Grande Porte</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Controller
                          name="acceptsPuppies"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label className="font-normal">Filhotes</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="experience">Experiência com Pets</Label>
                    <Textarea
                      id="experience"
                      {...register("experience")}
                      placeholder="Descreva sua experiência..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição do Lar</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Conte mais sobre o espaço..."
                    />
                  </div>
                </div>
              </div>

              {/* Upload de Imagem */}
              <div>
                <Label htmlFor="imageUpload">Foto do Espaço *</Label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <>
                      <div
                        className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 transition-colors"
                        onClick={() => document.getElementById('imageUpload')?.click()}
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="mx-auto max-h-48 rounded" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-500">
                            <Upload className="h-8 w-8" />
                            <p className="text-sm">Clique para fazer upload</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        id="imageUpload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </>
                  )}
                />
                {errors.image && (
                  <p className="text-sm text-red-500 mt-1">{String(errors.image.message)}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processando..." : "Continuar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Senha */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewUser ? "Criar Senha" : "Digite sua Senha"}</DialogTitle>
            <DialogDescription>
              {isNewUser
                ? "Como este é seu primeiro lar, crie uma senha para gerenciar suas propriedades."
                : "Você já possui lares cadastrados. Digite sua senha para adicionar um novo lar."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isNewUser && (
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordSubmit}>
              {isNewUser ? "Criar Lar" : "Autenticar e Criar Lar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterHome;
