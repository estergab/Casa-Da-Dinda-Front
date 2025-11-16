import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { toast } from "sonner";

const SolicitacoesLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [userType, setUserType] = useState<"host" | "tutor" | null>(null);

  // ✅ Verificar se email existe e determinar tipo de usuário
  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      toast.error("Por favor, digite seu e-mail");
      return;
    }

    setIsLoading(true);

    try {
      // Verificar se é anfitrião
      const hostCheck = await api.get(`/lares/check-email/${email.toLowerCase()}`);
      
      if (hostCheck.data.exists) {
        setUserType("host");
        setShowPasswordDialog(true);
        setIsLoading(false);
        return;
      }

      // Verificar se é tutor
      const tutorCheck = await api.get(`/solicitacoes/check-tutor-email/${email.toLowerCase()}`);
      
      if (tutorCheck.data.exists) {
        setUserType("tutor");
        setShowPasswordDialog(true);
        setIsLoading(false);
        return;
      }

      // Email não encontrado
      toast.error("Email não encontrado. Cadastre-se primeiro como anfitrião ou tutor.");
      setIsLoading(false);
    } catch (error: any) {
      console.error("Erro ao verificar email:", error);
      toast.error("Erro ao verificar email. Tente novamente.");
      setIsLoading(false);
    }
  };

  // ✅ Autenticar usuário com senha
  const handlePasswordSubmit = async () => {
    if (!password) {
      toast.error("Digite sua senha");
      return;
    }

    setIsLoading(true);

    try {
      if (userType === "host") {
        // Autenticar anfitrião
        const response = await api.post('/lares/authenticate', {
          email: email.toLowerCase(),
          password: password
        });

        if (response.data.success) {
          toast.success("Login realizado com sucesso!");
          
          // Salvar email no localStorage para usar na lista de solicitações
          localStorage.setItem("userEmail", email.toLowerCase());
          localStorage.setItem("userType", "host");
          
          setTimeout(() => navigate("/solicitacoes-lista"), 1000);
        }
      } else if (userType === "tutor") {
        // Autenticar tutor
        const response = await api.post('/solicitacoes/authenticate-tutor', {
          email: email.toLowerCase(),
          password: password
        });

        if (response.data.success) {
          toast.success("Login realizado com sucesso!");
          
          // Salvar email no localStorage
          localStorage.setItem("userEmail", email.toLowerCase());
          localStorage.setItem("userType", "tutor");
          
          setTimeout(() => navigate("/solicitacoes-lista"), 1000);
        }
      }
    } catch (error: any) {
      console.error("Erro na autenticação:", error);
      toast.error(error.response?.data?.message || "Senha incorreta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Mail className="h-6 w-6" />
                Acessar Minhas Solicitações
              </CardTitle>
              <CardDescription>
                Digite seu e-mail para visualizar suas solicitações de hospedagem
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEmailSubmit();
                    }
                  }}
                />
              </div>

              <Button
                onClick={handleEmailSubmit}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Verificando..." : "Continuar"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Ainda não se cadastrou?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => navigate("/cadastrar-lar")}
                  >
                    Cadastre um lar
                  </Button>{" "}
                  ou{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => navigate("/lares")}
                  >
                    solicite hospedagem
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ✅ MODAL DE SENHA */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Digite sua Senha
            </DialogTitle>
            <DialogDescription>
              {userType === "host" 
                ? "Você é um anfitrião. Digite sua senha para acessar suas solicitações."
                : "Você é um tutor. Digite sua senha para acessar suas solicitações."}
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePasswordSubmit();
                    }
                  }}
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
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPasswordDialog(false);
                setPassword("");
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handlePasswordSubmit} disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SolicitacoesLogin;
