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
import { getUploadUrl } from "@/config/api"; // ✅ ADICIONAR
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
  const email = searchParams.get("email");

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

  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHome = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/lares/${id}`);
        const larData = response.data.data || response.data;

        // Parse availableFor se vier como string
        let availableForArray: string[] = [];
        if (typeof larData.availableFor === 'string') {
          try {
            availableForArray = JSON.parse(larData.availableFor);
          } catch {
            availableForArray = [larData.availableFor];
          }
        } else if (Array.isArray(larData.availableFor)) {
          availableForArray = larData.availableFor;
        }

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
          availableFor: availableForArray,
        });

        if (larData.imageUrl) {
          setCurrentImageUrl(larData.imageUrl);
        }
      } catch (error) {
        console.error("Erro ao carregar lar:", error);
        toast.error("Erro ao carregar dados do lar");
        navigate("/lares");
      }
    };

    fetchHome();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (field: keyof FormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleAvailableForChange = (type: string) => {
    setFormData((prev) => {
      const newAvailableFor = prev.availableFor.includes(type)
        ? prev.availableFor.filter((t) => t !== type)
        : [...prev.availableFor, type];
      return { ...prev, availableFor: newAvailableFor };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.hostName || !formData.email || !formData.phone) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.availableFor.length === 0) {
      toast.error("Selecione pelo menos um tipo de pet");
      return;
    }

    try {
      setIsLoading(true);

      const submitData = new FormData();
      submitData.append("hostName", formData.hostName);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("city", formData.city);
      submitData.append("state", formData.state);
      submitData.append("address", formData.address);
      submitData.append("capacity", String(formData.capacity));
      submitData.append("hasYard", String(formData.hasYard));
      submitData.append("hasFence", String(formData.hasFence));
      submitData.append("experience", formData.experience);
      submitData.append("description", formData.description);

      formData.availableFor.forEach((type) => {
        submitData.append("availableFor", type);
      });

      if (newImage) {
        submitData.append("image", newImage);
      }

      const response = await api.put(`/lares/${id}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Lar atualizado:", response.data);
      toast.success("Lar atualizado com sucesso!");
      
      if (email) {
        navigate(`/solicitacoes/${email}`);
      } else {
        navigate("/lares");
      }
    } catch (error: any) {
      console.error("❌ Erro ao atualizar lar:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar lar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 py-8">
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
              Editar Lar Temporário
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Pessoais */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Suas Informações</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hostName">Nome Completo *</Label>
                    <Input
                      id="hostName"
                      name="hostName"
                      value={formData.hostName}
                      onChange={handleInputChange}
                      placeholder="Seu nome"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Endereço</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Rua, número"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Cidade"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>

              {/* Sobre o Lar */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sobre o Lar</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidade (pets) *</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min={1}
                      max={20}
                    />
                  </div>

                  <div>
                    <Label className="mb-3 block">Características</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasYard"
                          checked={formData.hasYard}
                          onCheckedChange={() => handleCheckboxChange("hasYard")}
                        />
                        <Label htmlFor="hasYard" className="cursor-pointer">
                          Possui quintal
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasFence"
                          checked={formData.hasFence}
                          onCheckedChange={() => handleCheckboxChange("hasFence")}
                        />
                        <Label htmlFor="hasFence" className="cursor-pointer">
                          Quintal cercado
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Aceita *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Cães", "Gatos", "Cães de Grande Porte", "Filhotes"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={formData.availableFor.includes(type)}
                            onCheckedChange={() => handleAvailableForChange(type)}
                          />
                          <Label htmlFor={type} className="cursor-pointer">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiência com Pets</Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Conte sobre sua experiência com animais"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição do Lar</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Descreva seu espaço e o que pode oferecer"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Upload de Imagem */}
              <div>
                <Label htmlFor="imageUpload">Foto do Espaço</Label>
                <div className="mt-2">
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                  >
                    {previewUrl || currentImageUrl ? (
                      <img
                        src={previewUrl || getUploadUrl(currentImageUrl)} // ✅ USAR getUploadUrl
                        alt="Preview"
                        className="mx-auto max-h-64 rounded"
                      />
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Clique para alterar a imagem
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EditHome;

