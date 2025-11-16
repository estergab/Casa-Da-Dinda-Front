import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Users, Eye, Edit, LogOut, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import api from "@/services/api";

interface Solicitacao {
  id: string;
  homeId: string;
  hostEmail: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  petName: string;
  petType: "dog" | "cat";
  petAge?: string;
  petSize?: string;
  petImageUrl?: string;
  startDate?: string;
  duration?: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface Lar {
  _id: string;
  id: string;
  hostName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  capacity: number;
  hasYard: boolean;
  hasFence: boolean;
  availableFor: string[];
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

const SolicitacoesList = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail") || "";
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [lares, setLares] = useState<Lar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"solicitacoes" | "lares">("solicitacoes");

  useEffect(() => {
    if (!email) {
      toast.error("Sessão expirada. Faça login novamente.");
      navigate("/solicitacoes-login");
      return;
    }

    fetchData();
  }, [email, navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Buscar solicitações
      const solicitacoesResponse = await api.get(`/solicitacoes/email/${email}`);
      const solicitacoesData = solicitacoesResponse.data.data || solicitacoesResponse.data || [];
      setSolicitacoes(Array.isArray(solicitacoesData) ? solicitacoesData : []);

      // Buscar lares
      const laresResponse = await api.get(`/lares/email/${email}`);
      const laresData = laresResponse.data.data || laresResponse.data || [];
      setLares(Array.isArray(laresData) ? laresData : []);

    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar seus dados");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    toast.success("Logout realizado com sucesso");
    navigate("/");
  };

  const handleToggleActive = async (larId: string, isActive: boolean) => {
    try {
      await api.patch(`/lares/${larId}/toggle-active`);
      toast.success(`Lar ${isActive ? "desativado" : "ativado"} com sucesso`);
      
      // Atualizar estado local
      setLares(prevLares =>
        prevLares.map(lar =>
          lar._id === larId || lar.id === larId
            ? { ...lar, isActive: !isActive }
            : lar
        )
      );
    } catch (error: any) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status do lar");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50">Pendente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Aceita</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700">Negada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return dateString;
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Minhas Solicitações e Lares</h1>
            <p className="text-gray-600">{email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "solicitacoes" ? "default" : "outline"}
            onClick={() => setActiveTab("solicitacoes")}
          >
            Minhas Solicitações ({solicitacoes.length})
          </Button>
          <Button
            variant={activeTab === "lares" ? "default" : "outline"}
            onClick={() => setActiveTab("lares")}
          >
            Meus Lares ({lares.length})
          </Button>
        </div>

        {/* Conteúdo - Solicitações */}
        {activeTab === "solicitacoes" && (
          <div className="space-y-4">
            {solicitacoes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    Você ainda não fez nenhuma solicitação de hospedagem.
                  </p>
                  <Button onClick={() => navigate("/lares")}>
                    Procurar Lares Temporários
                  </Button>
                </CardContent>
              </Card>
            ) : (
              solicitacoes.map((solicitacao) => (
                <Card key={solicitacao.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          Pet: {solicitacao.petName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {solicitacao.petType === "dog" ? "Cão" : "Gato"}
                          {solicitacao.petSize && ` • ${solicitacao.petSize}`}
                          {solicitacao.petAge && ` • ${solicitacao.petAge}`}
                        </p>
                      </div>
                      {getStatusBadge(solicitacao.status)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>Anfitrião: {solicitacao.hostEmail}</span>
                      </div>

                      {solicitacao.startDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Início: {formatDate(solicitacao.startDate)}</span>
                        </div>
                      )}

                      {solicitacao.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>Duração: {solicitacao.duration}</span>
                        </div>
                      )}

                      <div className="text-sm text-gray-500">
                        Enviada em {formatDate(solicitacao.createdAt)}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/solicitacao/${solicitacao.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Conteúdo - Lares */}
        {activeTab === "lares" && (
          <div className="space-y-4">
            {lares.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    Você ainda não cadastrou nenhum lar temporário.
                  </p>
                  <Button onClick={() => navigate("/cadastrar")}>
                    Cadastrar Lar Temporário
                  </Button>
                </CardContent>
              </Card>
            ) : (
              lares.map((lar) => (
                <Card key={lar._id || lar.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          Casa de {lar.hostName}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{lar.city}, {lar.state}</span>
                        </div>
                      </div>
                      <Badge variant={lar.isActive ? "default" : "secondary"}>
                        {lar.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>Capacidade: {lar.capacity} pets</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{lar.email}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{lar.phone}</span>
                      </div>
                    </div>

                    {lar.availableFor && lar.availableFor.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Aceita:</p>
                        <div className="flex flex-wrap gap-2">
                          {lar.availableFor.map((type, idx) => (
                            <Badge key={idx} variant="outline">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/editar/${lar._id || lar.id}?email=${email}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(lar._id || lar.id, lar.isActive)}
                      >
                        <Power className="mr-2 h-4 w-4" />
                        {lar.isActive ? "Desativar" : "Ativar"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/lar/${lar._id || lar.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Página
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SolicitacoesList;
