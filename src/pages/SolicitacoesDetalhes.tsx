import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, Calendar, User, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { getUploadUrl } from "@/config/api"; // ✅ ADICIONAR
import { toast } from "sonner";

interface Solicitacao {
  id: string;
  _id: string;
  homeId: string;
  hostEmail: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  petName: string;
  petType: "dog" | "cat";
  petAge?: string;
  petSize?: string;
  healthConditions?: string;
  behavior?: string;
  petImageUrl?: string;
  startDate?: string;
  duration?: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const SolicitacoesDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchSolicitacao = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/solicitacoes/${id}`);
        const data = response.data.data || response.data;
        setSolicitacao(data);
      } catch (error) {
        console.error("Erro ao carregar solicitação:", error);
        toast.error("Erro ao carregar detalhes da solicitação");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchSolicitacao();
  }, [id, navigate]);

  const handleAceitar = async () => {
    if (!solicitacao) return;

    try {
      setIsProcessing(true);
      await api.patch(`/solicitacoes/${solicitacao._id || solicitacao.id}/aceitar`);
      toast.success("Solicitação aceita!");
      setSolicitacao({ ...solicitacao, status: "approved" });
    } catch (error: any) {
      console.error("Erro ao aceitar:", error);
      toast.error(error.response?.data?.message || "Erro ao aceitar solicitação");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNegar = async () => {
    if (!solicitacao) return;

    try {
      setIsProcessing(true);
      await api.patch(`/solicitacoes/${solicitacao._id || solicitacao.id}/negar`);
      toast.success("Solicitação negada");
      setSolicitacao({ ...solicitacao, status: "rejected" });
    } catch (error: any) {
      console.error("Erro ao negar:", error);
      toast.error(error.response?.data?.message || "Erro ao negar solicitação");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não informado";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return dateString;
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

  if (!solicitacao) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-500 mb-4">Solicitação não encontrada</p>
          <Button onClick={() => navigate(-1)}>Voltar</Button>
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

        {/* Header com Status */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Detalhes da Solicitação</h1>
            <p className="text-gray-600">Pet: {solicitacao.petName}</p>
          </div>
          {getStatusBadge(solicitacao.status)}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Card do Pet */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Pet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {solicitacao.petImageUrl && (
                  <div className="mb-4">
                    <img
                      src={getUploadUrl(solicitacao.petImageUrl)} // ✅ USAR getUploadUrl
                      alt={solicitacao.petName}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-medium">{solicitacao.petName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Tipo</p>
                    <p className="font-medium">
                      {solicitacao.petType === "dog" ? "Cão" : "Gato"}
                    </p>
                  </div>

                  {solicitacao.petAge && (
                    <div>
                      <p className="text-sm text-gray-500">Idade</p>
                      <p className="font-medium">{solicitacao.petAge}</p>
                    </div>
                  )}

                  {solicitacao.petSize && (
                    <div>
                      <p className="text-sm text-gray-500">Porte</p>
                      <p className="font-medium">{solicitacao.petSize}</p>
                    </div>
                  )}
                </div>

                {solicitacao.healthConditions && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Condições de Saúde</p>
                    <p className="text-gray-700">{solicitacao.healthConditions}</p>
                  </div>
                )}

                {solicitacao.behavior && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Comportamento</p>
                    <p className="text-gray-700">{solicitacao.behavior}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detalhes da Estadia */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Estadia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {solicitacao.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Data de Início</p>
                        <p className="font-medium">{formatDate(solicitacao.startDate)}</p>
                      </div>
                    </div>
                  )}

                  {solicitacao.duration && (
                    <div>
                      <p className="text-sm text-gray-500">Duração Estimada</p>
                      <p className="font-medium">{solicitacao.duration}</p>
                    </div>
                  )}
                </div>

                {solicitacao.message && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Mensagem</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">
                      {solicitacao.message}
                    </p>
                  </div>
                )}

                <Separator />

                <div className="text-sm text-gray-500">
                  Enviada em {formatDate(solicitacao.createdAt)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral - Informações do Solicitante */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Solicitante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-medium">{solicitacao.requesterName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium break-all text-sm">
                      {solicitacao.requesterEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium">{solicitacao.requesterPhone}</p>
                  </div>
                </div>

                <Separator />

                {/* Ações */}
                {solicitacao.status === "pending" && (
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleAceitar}
                      disabled={isProcessing}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Aceitar Solicitação
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:bg-red-50"
                      onClick={handleNegar}
                      disabled={isProcessing}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Negar Solicitação
                    </Button>
                  </div>
                )}

                {solicitacao.status === "approved" && (
                  <div className="text-center p-4 bg-green-50 rounded">
                    <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">Solicitação Aceita</p>
                    <p className="text-sm text-green-600 mt-1">
                      Entre em contato com o solicitante
                    </p>
                  </div>
                )}

                {solicitacao.status === "rejected" && (
                  <div className="text-center p-4 bg-red-50 rounded">
                    <X className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-red-700 font-medium">Solicitação Negada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SolicitacoesDetalhes;

