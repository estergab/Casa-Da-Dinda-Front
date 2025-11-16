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
  
  // ✅ Estados para modal de senha
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

  // ✅ Verificar se email existe ao sair do campo
  const handleEmailBlur = async () => {
    const email = getValues("email");
    if (!email) return;

    try {
      const response = await api.get(`/lares/check-email/${email.toLowerCase()}`);
      
      if (response.data.exists) {
        // Email já existe - pedir senha existente
        setIsNewUser(false);
      } else {
        // Email novo - pedir cadastro de senha
        setIsNewUser(true);
      }
    } catch (error) {
      console.error("Erro ao verificar email:", error);
    }
  };

  // ✅ Ao submeter o formulário, abrir modal de senha
  const onSubmit = async (data: RegisterHomeForm) => {
    console.log("✅ FORMULÁRIO VÁLIDO! Abrindo modal de senha...");
    setPendingFormData(data);
    setShowPasswordModal(true);
  };

  // ✅ Processar cadastro com senha
  const handlePasswordSubmit = async () => {
    if (!pendingFormData) return;

    // Validar senha
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
      // Autenticar com senha existente
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

    // Continuar com o cadastro
    try {
      const formData = new FormData();
      
      formData.append("hostName", pendingFormData.name);
      formData.append("email", pendingFormData.email.toLowerCase());
      formData.append("password", password); // ✅ Adicionar senha
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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-6 w-6" />
                Cadastrar Lar Temporário
              </CardTitle>
              <CardDescription>
                Preencha as informações para oferecer um lar temporário.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                {/* Informações Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Suas Informações</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Seu nome"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      onBlur={handleEmailBlur}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="(00) 00000-0000"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Endereço</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço *</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      placeholder="Rua, número"
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade *</Label>
                      <Input
                        id="city"
                        {...register("city")}
                        placeholder="Cidade"
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">{errors.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">Estado *</Label>
                      <Input
                        id="state"
                        {...register("state")}
                        placeholder="UF"
                        maxLength={2}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive">{errors.state.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sobre o Lar */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sobre o Lar</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidade (pets) *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      {...register("capacity")}
                      placeholder="Quantos pets pode receber?"
                    />
                    {errors.capacity && (
                      <p className="text-sm text-destructive">{errors.capacity.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Características</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="hasYard"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="hasYard"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label htmlFor="hasYard" className="font-normal">
                          Possui quintal
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Controller
                          name="hasFence"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="hasFence"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label htmlFor="hasFence" className="font-normal">
                          Quintal cercado
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Aceita</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="acceptsDogs"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="acceptsDogs"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label htmlFor="acceptsDogs" className="font-normal">
                          Cães
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Controller
                          name="acceptsCats"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="acceptsCats"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label htmlFor="acceptsCats" className="font-normal">
                          Gatos
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Controller
                          name="acceptsLargeDogs"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="acceptsLargeDogs"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label htmlFor="acceptsLargeDogs" className="font-normal">
                          Cães de Grande Porte
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Controller
                          name="acceptsPuppies"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="acceptsPuppies"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label htmlFor="acceptsPuppies" className="font-normal">
                          Filhotes
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiência com Pets</Label>
                    <Textarea
                      id="experience"
                      {...register("experience")}
                      placeholder="Conte sobre sua experiência com animais"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição do Lar</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Descreva seu lar e o ambiente"
                    />
                  </div>
                </div>

                {/* Upload de Imagem */}
                <div className="space-y-4">
                  <Label>Foto do Espaço *</Label>
                  <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <>
                        <div
                          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                          onClick={() => document.getElementById('imageUpload')?.click()}
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-64 mx-auto rounded"
                            />
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Clique para fazer upload
                              </p>
                            </div>
                          )}
                        </div>
                        <input
                          {...field}
                          id="imageUpload"
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
                    )}
                  />
                  {errors.image && (
                    <p className="text-sm text-destructive">{errors.image.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Processando..." : "Continuar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ✅ MODAL DE SENHA */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isNewUser ? "Criar Senha" : "Digite sua Senha"}
            </DialogTitle>
            <DialogDescription>
              {isNewUser 
                ? "Como este é seu primeiro lar, crie uma senha para gerenciar suas propriedades."
                : "Você já possui lares cadastrados. Digite sua senha para adicionar um novo lar."}
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

            {isNewUser && (
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
              {isNewUser ? "Criar Lar" : "Autenticar e Criar Lar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterHome;
