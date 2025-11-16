import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Home, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { toast } from "sonner";

interface FormData {
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
  description: string;
  availableFor: string[];
}

const EditHome = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState<FormData>({
    hostName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    address: "",
    capacity: 1,
    hasYard: false,
    hasFence: false,
    experience: "",
    description: "",
    availableFor: [],
  });

  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loggedUserEmail = searchParams.get("email") || "";

  console.log("👤 Email do usuário:", loggedUserEmail);

  // ✅ CARREGAR DADOS DO LAR
  useEffect(() => {
    if (!id) {
      toast.error("ID do lar não fornecido");
      navigate("/lares");
      return;
    }

    const fetchLar = async () => {
      try {
        setIsLoading(true);
        console.log("🔍 Buscando lar para editar:", id);

        const response = await api.get(`/lares/${id}`);
        const larData = response.data.data || response.data;

        console.log("✅ Lar carregado:", larData);

        // Verificar se é o dono
        if (larData.email.toLowerCase() !== loggedUserEmail.toLowerCase()) {
          toast.error("Você não tem permissão para editar este lar");
          navigate(`/lares/${id}`);
          return;
        }

        // Preencher formulário
        setFormData({
          hostName: larData.hostName || "",
          email: larData.email || "",
          phone: larData.phone || "",
          city: larData.city || "",
          state: larData.state || "",
          address: larData.address || "",
          capacity: larData.capacity || 1,
          hasYard: larData.hasYard || false,
          hasFence: larData.hasFence || false,
          experience: larData.experience || "",
          description: larData.description || "",
          availableFor: larData.availableFor || [],
        });

        if (larData.imageUrl) {
          setCurrentImageUrl(larData.imageUrl);
        }

      } catch (error: any) {
        console.error("❌ Erro ao buscar lar:", error);
        toast.error("Erro ao carregar dados do lar");
        navigate("/lares");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLar();
  }, [id, loggedUserEmail, navigate]);

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 1 : value,
    }));
  };

  // ✅ HANDLE CHECKBOX CHANGE
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // ✅ HANDLE DISPONIBILIDADE CHANGE
  const handleAvailableForChange = (type: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availableFor: checked
        ? [...prev.availableFor, type]
        : prev.availableFor.filter((t) => t !== type),
    }));
  };

  // ✅ HANDLE IMAGE CHANGE
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ✅ SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      setIsSaving(true);
      console.log("💾 Salvando alterações do lar...");

      const formDataToSend = new FormData();
      
      // Adicionar todos os campos
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "availableFor") {
          // Enviar array como múltiplos campos
          (value as string[]).forEach((v) => {
            formDataToSend.append("availableFor[]", v);
          });
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      // Adicionar nova imagem se houver
      if (newImage) {
        formDataToSend.append("image", newImage);
      }

      const response = await api.put(`/lares/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Lar atualizado com sucesso:", response.data);
      toast.success("Lar atualizado com sucesso!");
      navigate(`/lares/${id}?email=${encodeURIComponent(loggedUserEmail)}`);

    } catch (error: any) {
      console.error("❌ Erro ao atualizar lar:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar lar");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Home className="h-8 w-8 text-primary" />
            Editar Meu Anúncio
          </h1>
          <p className="text-muted-foreground">
            Atualize as informações do seu lar temporário
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* INFORMAÇÕES BÁSICAS */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hostName">Nome Completo *</Label>
                  <Input
                    id="hostName"
                    name="hostName"
                    value={formData.hostName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">Capacidade (número de pets) *</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* ENDEREÇO */}
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Rua e Número *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* CARACTERÍSTICAS */}
            <Card>
              <CardHeader>
                <CardTitle>Características</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasYard"
                    checked={formData.hasYard}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("hasYard", checked as boolean)
                    }
                  />
                  <Label htmlFor="hasYard">Possui quintal</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasFence"
                    checked={formData.hasFence}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("hasFence", checked as boolean)
                    }
                  />
                  <Label htmlFor="hasFence">Possui cerca</Label>
                </div>

                <div>
                  <Label>Aceita *</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dog"
                        checked={formData.availableFor.includes("dog")}
                        onCheckedChange={(checked) =>
                          handleAvailableForChange("dog", checked as boolean)
                        }
                      />
                      <Label htmlFor="dog">🐕 Cães</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cat"
                        checked={formData.availableFor.includes("cat")}
                        onCheckedChange={(checked) =>
                          handleAvailableForChange("cat", checked as boolean)
                        }
                      />
                      <Label htmlFor="cat">🐱 Gatos</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* IMAGEM */}
            <Card>
              <CardHeader>
                <CardTitle>Foto do Lar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(previewUrl || currentImageUrl) && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <img
                      src={previewUrl || `http://localhost:3335${currentImageUrl}`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="image">
                    {currentImageUrl ? "Alterar Foto" : "Adicionar Foto"}
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Formatos aceitos: JPG, PNG, JPEG
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* EXPERIÊNCIA */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Experiência com Pets</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Conte sobre sua experiência com animais..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* DESCRIÇÃO */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva seu lar e o ambiente que você oferece..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-4 justify-end mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHome;
