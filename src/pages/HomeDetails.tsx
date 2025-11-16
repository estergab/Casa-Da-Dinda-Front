import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Home as HomeIcon, Users, Check, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { TemporaryHome } from "@/lib/mockData";
import api from "@/services/api";
import { getUploadUrl } from "@/config/api"; // ✅ ADICIONAR
import { toast } from "sonner";

const HomeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [home, setHome] = useState<TemporaryHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHome = async () => {
      if (!id) {
        toast.error("ID do lar não fornecido");
        navigate("/lares");
        return;
      }

      try {
        setIsLoading(true);
        console.log("🔍 Buscando lar com ID:", id);
        const response = await api.get(`/lares/${id}`);
        console.log("✅ Lar carregado:", response.data);

        const larData = response.data.data || response.data;

        // Parse do availableFor se vier como string JSON
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

        const homeFormatted: TemporaryHome = {
          id: larData._id || larData.id,
          hostName: larData.hostName || "",
          email: larData.email || "",
          phone: larData.phone || "",
          city: larData.city || "",
          state: larData.state || "",
          address: larData.address || "",
          capacity: larData.capacity || 0,
          hasYard: larData.hasYard || false,
          hasFence: larData.hasFence || false,
          experience: larData.experience || "",
          availableFor: availableForArray,
          description: larData.description || "",
          imageUrl: larData.imageUrl || "/placeholder.svg", // ✅ Guardar só o path
          createdAt: larData.createdAt ? new Date(larData.createdAt) : new Date(),
        };

        setHome(homeFormatted);
      } catch (error: any) {
        console.error("❌ Erro ao carregar lar:", error);
        toast.error("Erro ao carregar detalhes do lar");
        navigate("/lares");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHome();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Carregando detalhes...</p>
        </div>
      </>
    );
  }

  if (!home) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-500 mb-4">Lar não encontrado.</p>
          <Button onClick={() => navigate("/lares")}>
            Voltar para Lista
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          onClick={() => navigate("/lares")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {/* Imagem */}
        <div className="relative h-[400px] rounded-lg overflow-hidden mb-6">
          <img
            src={getUploadUrl(home.imageUrl)} // ✅ USAR getUploadUrl
            alt={`Casa de ${home.hostName}`}
            className="w-full h-full object-cover"
          />
          {home.hasYard && (
            <Badge className="absolute top-4 right-4 bg-green-500">
              Com Quintal
            </Badge>
          )}
        </div>

        {/* Informações */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Casa de {home.hostName}</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {home.address}, {home.city} - {home.state}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card de Informações Principais */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HomeIcon className="h-5 w-5" />
                  Informações do Lar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Capacidade */}
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>Capacidade: {home.capacity} pets</span>
                </div>

                {/* Características */}
                <div>
                  <p className="font-semibold mb-2">Características:</p>
                  <div className="flex gap-2 flex-wrap">
                    {home.hasYard && (
                      <Badge variant="secondary">
                        <Check className="h-3 w-3 mr-1" />
                        Quintal
                      </Badge>
                    )}
                    {home.hasFence && (
                      <Badge variant="secondary">
                        <Check className="h-3 w-3 mr-1" />
                        Cercado
                      </Badge>
                    )}
                    {!home.hasYard && !home.hasFence && (
                      <span className="text-sm text-gray-500">
                        Sem características especiais
                      </span>
                    )}
                  </div>
                </div>

                {/* Aceita */}
                <div>
                  <p className="font-semibold mb-2">Aceita:</p>
                  <div className="flex gap-2 flex-wrap">
                    {home.availableFor && home.availableFor.length > 0 ? (
                      home.availableFor.map((type, index) => (
                        <Badge key={index} variant="outline">
                          {type}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">
                        Não especificado
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descrição */}
            {home.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Sobre o Lar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{home.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Experiência */}
            {home.experience && (
              <Card>
                <CardHeader>
                  <CardTitle>Experiência com Pets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{home.experience}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Card de Contato */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="break-all">{home.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{home.phone}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      Anfitrião: <strong>{home.hostName}</strong>
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => navigate(`/solicitar-estadia/${home.id}`)}
                >
                  Solicitar Hospedagem
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeDetails;
