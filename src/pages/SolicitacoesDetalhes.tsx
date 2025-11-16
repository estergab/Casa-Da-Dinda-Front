import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, PawPrint, Calendar, User, Phone, Mail, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { toast } from "sonner";

interface Solicitacao {
  _id: string;
  id: string; // ✅ UUID
  homeId: string;
  hostEmail: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  petName: string;
  petType: string;
  petAge?: string;
  petSize?: string;
  healthConditions?: string;
  behavior?: string;
  petImageUrl?: string;
  startDate?: string;
  duration?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const SolicitacoesDetalhes = () => {
  const { id } = useParams(); // ✅ UUID da URL
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const loggedUserEmail = 
    searchParams.get("email") || 
    localStorage.getItem("userEmail") || 
    "";

  console.log("👤 Email do usuário logado:", loggedUserEmail);

  useEffect(() => {
    if (!id) {
      toast.error("ID da solicitação não fornecido");
      navigate("/solicitacoes");
      return;
    }

    const fetchSolicitacao = async () => {
      try {
        setIsLoading(true);
        console.log("🔍 Buscando solicitação:", id);

        const response = await api.get(`/solicitacoes/${id}`);
        
        console.log("✅ Solicitação carregada:", response.data);
        
        const solicitacaoData = response.data.data || response.data;
        setSolicitacao(solicitacaoData);

        console.log("📧 Email da solicitação (tutor):", solicitacaoData.requesterEmail);
        console.log("🏠 Email do anfitrião:", solicitacaoData.hostEmail);
        console.log("👤 Email do usuário:", loggedUserEmail);
      } catch (error: any) {
        console.error("❌ Erro ao buscar solicitação:", error);
        toast.error("Erro ao carregar detalhes da solicitação");
        navigate("/solicitacoes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolicitacao();
  }, [id, navigate]);

  // ✅ CANCELAR SOLICITAÇÃO (apenas tutor)
  const handleCancelarSolicitacao = async () => {
    if (!id) return; // ✅ Usar `id` da URL

    try {
      setIsDeleting(true);
      console.log("🗑️ Cancelando solicitação:", id);

      await api.delete(`/solicitacoes/${id}`); // ✅ Usar `id`

      toast.success("Solicitação cancelada com sucesso!");
      
      setTimeout(() => {
        navigate(`/solicitacoes/lista?email=${encodeURIComponent(loggedUserEmail)}`);
      }, 1000);
    } catch (error: any) {
      console.error("❌ Erro ao cancelar solicitação:", error);
      toast.error("Erro ao cancelar solicitação", {
        description: error.response?.data?.message || "Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ ACEITAR SOLICITAÇÃO (apenas anfitrião)
  const handleAceitarSolicitacao = async () => {
    if (!id) return; // ✅ Usar `id` da URL

    try {
      setIsProcessing(true);
      console.log("✅ Aceitando solicitação:", id);

      await api.patch(`/solicitacoes/${id}/aceitar`); // ✅ Usar `id`

      toast.success("Solicitação aprovada com sucesso! 🎉");
      
      if (solicitacao) {
        setSolicitacao({ ...solicitacao, status: 'approved' });
      }
    } catch (error: any) {
      console.error("❌ Erro ao aceitar solicitação:", error);
      toast.error("Erro ao aprovar solicitação", {
        description: error.response?.data?.message || "Tente novamente.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ NEGAR SOLICITAÇÃO (apenas anfitrião)
  const handleNegarSolicitacao = async () => {
    if (!id) return; // ✅ Usar `id` da URL

    try {
      setIsProcessing(true);
      console.log("❌ Negando solicitação:", id);

      await api.patch(`/solicitacoes/${id}/negar`); // ✅ Usar `id`

      toast.success("Solicitação negada.");
      
      if (solicitacao) {
        setSolicitacao({ ...solicitacao, status: 'rejected' });
      }
    } catch (error: any) {
      console.error("❌ Erro ao negar solicitação:", error);
      toast.error("Erro ao negar solicitação", {
        description: error.response?.data?.message || "Tente novamente.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não informada";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const isTutor = solicitacao 
    ? solicitacao.requesterEmail.toLowerCase() === loggedUserEmail.toLowerCase()
    : false;

  const isHost = solicitacao
    ? solicitacao.hostEmail.toLowerCase() === loggedUserEmail.toLowerCase()
    : false;

  console.log("🔍 É tutor?", isTutor);
  console.log("🔍 É anfitrião?", isHost);

  const getStatusBadge = () => {
    if (!solicitacao) return null;

    switch (solicitacao.status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">✅ Aprovada</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">❌ Negada</Badge>;
      default:
        return <Badge variant="secondary">⏳ Aguardando decisão</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Carregando detalhes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!solicitacao) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">
                Solicitação não encontrada
              </p>
              <Button onClick={() => navigate("/solicitacoes")}>
                Voltar
              </Button>
            </CardContent>
          </Card>
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

          <div className="flex items-center gap-3">
            {getStatusBadge()}

            {/* ✅ BOTÕES ACEITAR/NEGAR - APENAS ANFITRIÃO + STATUS PENDING */}
            {isHost && solicitacao.status === 'pending' && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isProcessing}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Aceitar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Aceitar Solicitação?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Você confirma que pode receber <strong>{solicitacao.petName}</strong> no seu lar temporário?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleAceitarSolicitacao}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isProcessing ? "Processando..." : "Sim, aceitar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={isProcessing}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Negar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Negar Solicitação?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que não pode receber <strong>{solicitacao.petName}</strong>? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleNegarSolicitacao}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isProcessing ? "Processando..." : "Sim, negar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}

            {/* ✅ BOTÃO CANCELAR - APENAS TUTOR + STATUS PENDING */}
            {isTutor && solicitacao.status === 'pending' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Cancelar Solicitação
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. A solicitação será permanentemente removida
                      e o anfitrião não a verá mais.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Não, manter</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelarSolicitacao}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "Cancelando..." : "Sim, cancelar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* IMAGEM NO TOPO */}
        {solicitacao.petImageUrl && (
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={`http://localhost:3335${solicitacao.petImageUrl}`}
              alt={solicitacao.petName}
              className="w-full h-full object-contain bg-muted"
            />
          </div>
        )}

        {/* TÍTULO E BADGE */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <PawPrint className="h-8 w-8 text-primary" />
            {solicitacao.petName}
          </h1>
          <Badge variant="secondary" className="text-base">
            {solicitacao.petType === "dog" ? "Cão" : "Gato"}
          </Badge>
        </div>

        {/* CARDS DAS INFORMAÇÕES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações do Pet */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Pet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {solicitacao.petAge && (
                <div>
                  <p className="text-sm font-medium">Idade</p>
                  <p className="text-muted-foreground">{solicitacao.petAge}</p>
                </div>
              )}
              {solicitacao.petSize && (
                <div>
                  <p className="text-sm font-medium">Porte</p>
                  <p className="text-muted-foreground">{solicitacao.petSize}</p>
                </div>
              )}
              {solicitacao.healthConditions && (
                <div>
                  <p className="text-sm font-medium">Condições de Saúde</p>
                  <p className="text-muted-foreground">{solicitacao.healthConditions}</p>
                </div>
              )}
              {solicitacao.behavior && (
                <div>
                  <p className="text-sm font-medium">Comportamento</p>
                  <p className="text-muted-foreground">{solicitacao.behavior}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações do Tutor */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Tutor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Nome</p>
                  <p className="text-muted-foreground">{solicitacao.requesterName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">E-mail</p>
                  <a href={`mailto:${solicitacao.requesterEmail}`} className="text-primary hover:underline">
                    {solicitacao.requesterEmail}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <a href={`tel:${solicitacao.requesterPhone}`} className="text-primary hover:underline">
                    {solicitacao.requesterPhone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Estadia */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Detalhes da Estadia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Data de Início</p>
                  <p className="text-muted-foreground">{formatDate(solicitacao.startDate)}</p>
                </div>
              </div>
              {solicitacao.duration && (
                <div>
                  <p className="text-sm font-medium">Duração Estimada</p>
                  <p className="text-muted-foreground">{solicitacao.duration}</p>
                </div>
              )}
              {solicitacao.message && (
                <div>
                  <p className="text-sm font-medium">Mensagem</p>
                  <p className="text-muted-foreground leading-relaxed">{solicitacao.message}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Enviada em</p>
                <p className="text-muted-foreground">{formatDate(solicitacao.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SolicitacoesDetalhes;
