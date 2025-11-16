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
}

const SolicitacoesList: React.FC = () => {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [meusLares, setMeusLares] = useState<Lar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userType, setUserType] = useState<"host" | "tutor" | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const type = localStorage.getItem("userType") as "host" | "tutor" | null;

    if (!email || !type) {
      toast.error("Você precisa fazer login primeiro");
      navigate("/solicitacoes-login");
      return;
    }

    setUserEmail(email);
    setUserType(type);
    fetchData(email, type);
  }, [navigate]);

  const fetchData = async (email: string, type: "host" | "tutor") => {
    setIsLoading(true);
    try {
      const solicitacoesResponse = await api.get(`/solicitacoes/email/${email}`);
      setSolicitacoes(solicitacoesResponse.data.data || []);

      if (type === "host") {
        try {
          const laresResponse = await api.get(`/lares/email/${email}`);
          const lares = laresResponse.data.data;
          
          if (lares && !Array.isArray(lares)) {
            setMeusLares([lares]);
          } else {
            setMeusLares(lares || []);
          }
        } catch (error: any) {
          if (error.response?.status !== 404) {
            console.error("Erro ao buscar lares:", error);
          }
          setMeusLares([]);
        }
      }
    } catch (error: any) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar suas solicitações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userType");
    toast.success("Logout realizado com sucesso");
    navigate("/solicitacoes-login");
  };

  // ✅ ATIVAR/DESATIVAR LAR
  const handleToggleActive = async (larId: string, isCurrentlyActive: boolean) => {
    try {
      await api.patch(`/lares/${larId}/toggle-active`);
      
      setMeusLares(prev => 
        prev.map(lar => 
          lar._id === larId ? { ...lar, isActive: !isCurrentlyActive } : lar
        )
      );

      toast.success(isCurrentlyActive ? "Lar desativado com sucesso" : "Lar ativado com sucesso");
    } catch (error) {
      console.error("Erro ao alternar status do lar:", error);
      toast.error("Erro ao alterar status do lar");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      approved: { label: "Aprovada", variant: "default" as const },
      rejected: { label: "Negada", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não informado";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  const isTutor = userType === "tutor";
  const isHost = userType === "host";

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando solicitações...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {isTutor ? "👤 Tutor" : "🏠 Anfitrião"}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Minhas Solicitações</CardTitle>
              <CardDescription>
                {isTutor
                  ? "Acompanhe o status das suas solicitações de hospedagem"
                  : "Gerencie as solicitações recebidas para seus lares"}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{userEmail}</span>
              </div>
            </CardHeader>
          </Card>

          {/* Lares do Anfitrião */}
          {isHost && meusLares.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Meus Lares</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {meusLares.map((lar) => (
                  <Card key={lar._id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{lar.hostName}</CardTitle>
                      <CardDescription>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {lar.city}, {lar.state}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {lar.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            Capacidade: {lar.capacity} pet(s)
                          </div>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant={lar.isActive ? "default" : "secondary"}>
                          {lar.isActive ? "🟢 Ativo" : "🔴 Inativo"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/editar-lar/${lar._id}?email=${encodeURIComponent(userEmail)}`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant={lar.isActive ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleToggleActive(lar._id, lar.isActive)}
                        >
                          <Power className="h-4 w-4 mr-2" />
                          {lar.isActive ? "Desativar" : "Ativar"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Separator className="my-8" />
            </div>
          )}

          {/* Lista de Solicitações */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {isTutor ? "Solicitações Enviadas" : "Solicitações Recebidas"}
            </h2>

            {solicitacoes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não {isTutor ? "enviou" : "recebeu"} nenhuma solicitação
                  </p>
                  {isTutor && (
                    <Button onClick={() => navigate("/lares")}>
                      Buscar Lares Disponíveis
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {solicitacoes.map((solicitacao) => (
                  <Card
                    key={solicitacao.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/solicitacoes/${solicitacao.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {solicitacao.petType === "dog" ? "🐕" : "🐱"} {solicitacao.petName}
                            {getStatusBadge(solicitacao.status)}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {isTutor
                              ? `Solicitação enviada para um lar`
                              : `Solicitado por ${solicitacao.requesterName}`}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {isTutor ? solicitacao.hostEmail : solicitacao.requesterEmail}
                        </div>
                        {!isTutor && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {solicitacao.requesterPhone}
                          </div>
                        )}
                        {solicitacao.startDate && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Início: {formatDate(solicitacao.startDate)}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Enviada em: {formatDate(solicitacao.createdAt)}
                        </div>
                      </div>

                      <Button className="w-full mt-4" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SolicitacoesList;
