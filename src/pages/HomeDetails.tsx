import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Home as HomeIcon, Users, Check, Mail, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { TemporaryHome } from "@/lib/mockData";
import api from "@/services/api";
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
          imageUrl: larData.imageUrl
            ? `http://localhost:3335${larData.imageUrl}`
            : "/placeholder.svg",
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
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg">Carregando detalhes...</p>
        </div>
      </>
    );
  }

  if (!home) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-8 text-center">
          <p className="text-muted-foreground mb-4">Lar não encontrado.</p>
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
      <div className="container mx-auto py-8 px-4">
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          onClick={() => navigate("/lares")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Imagem */}
          <div className="relative">
            <img
              src={home.imageUrl}
              alt={`Casa de ${home.hostName}`}
              className="w-full h-[400px] object-cover rounded-lg"
            />
            {home.hasYard && (
              <Badge className="absolute top-4 right-4">
                <Check className="mr-1 h-3 w-3" />
                Com Quintal
              </Badge>
            )}
          </div>

          {/* Informações */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Casa de {home.hostName}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {home.address}, {home.city} - {home.state}
              </p>
            </div>

            {/* Card de Informações Principais */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Lar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Capacidade */}
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Capacidade: {home.capacity} pets</span>
                </div>

                {/* Características */}
                <div>
                  <p className="font-semibold mb-2">Características:</p>
                  <div className="flex gap-2 flex-wrap">
                    {home.hasYard && (
                      <Badge variant="secondary">
                        <Check className="mr-1 h-3 w-3" />
                        Quintal
                      </Badge>
                    )}
                    {home.hasFence && (
                      <Badge variant="secondary">
                        <Check className="mr-1 h-3 w-3" />
                        Cercado
                      </Badge>
                    )}
                    {!home.hasYard && !home.hasFence && (
                      <span className="text-sm text-muted-foreground">
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
                      <span className="text-sm text-muted-foreground">
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
                  <p className="text-muted-foreground">{home.description}</p>
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
                  <p className="text-muted-foreground">{home.experience}</p>
                </CardContent>
              </Card>
            )}

            {/* Contato */}
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{home.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{home.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HomeIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Anfitrião: {home.hostName}</span>
                </div>
              </CardContent>
            </Card>

            {/* ✅ BOTÃO CORRIGIDO - ROTA CORRETA */}
            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate(`/solicitar-estadia/${home.id}`)}
            >
              Solicitar Hospedagem
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeDetails;
