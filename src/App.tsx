import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ✅ IMPORTS DE TODAS AS PÁGINAS
import Index from "./pages/Index";
import RegisterHome from "./pages/RegisterHome";
import HomesList from "./pages/HomesList";
import HomeDetails from "./pages/HomeDetails";
import EditHome from "./pages/EditHome";
import RequestStay from "./pages/RequestStay";
import SolicitacoesLogin from "./pages/SolicitacoesLogin";
import SolicitacoesList from "./pages/SolicitacoesList";
import SolicitacoesDetalhes from "./pages/SolicitacoesDetalhes";
import NotFound from "./pages/NotFound";
import AumigosList from "./pages/AumigosList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ✅ PÁGINA INICIAL */}
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Index />} />
          <Route path="/inicio" element={<Index />} />

          {/* ✅ CADASTRO DE LAR - TODAS AS VARIAÇÕES */}
          <Route path="/cadastrar" element={<RegisterHome />} />
          <Route path="/cadastrar-lar" element={<RegisterHome />} />
          <Route path="/register" element={<RegisterHome />} />
          <Route path="/register-home" element={<RegisterHome />} />

          {/* ✅ LARES - LISTAGEM E DETALHES */}
          <Route path="/lares" element={<HomesList />} />
          <Route path="/homes" element={<HomesList />} />
          <Route path="/lar/:id" element={<HomeDetails />} />
          <Route path="/home/:id" element={<HomeDetails />} />
          
          {/* ✅ EDITAR LAR - TODAS AS VARIAÇÕES */}
          <Route path="/editar/:id" element={<EditHome />} />
          <Route path="/editar-lar/:id" element={<EditHome />} />
          <Route path="/edit/:id" element={<EditHome />} />
          <Route path="/edit-home/:id" element={<EditHome />} />
          
          {/* ✅ SOLICITAR ESTADIA - TODAS AS VARIAÇÕES */}
          <Route path="/solicitar/:id" element={<RequestStay />} />
          <Route path="/solicitar-estadia/:id" element={<RequestStay />} />
          <Route path="/request/:id" element={<RequestStay />} />
          <Route path="/request-stay/:id" element={<RequestStay />} />

          {/* ✅ SOLICITAÇÕES - TODAS AS VARIAÇÕES */}
          <Route path="/solicitacoes-login" element={<SolicitacoesLogin />} />
          <Route path="/login-solicitacoes" element={<SolicitacoesLogin />} />
          <Route path="/requests-login" element={<SolicitacoesLogin />} />
          
          <Route path="/solicitacoes-lista" element={<SolicitacoesList />} />
          <Route path="/solicitacoes" element={<SolicitacoesList />} />
          <Route path="/solicitacoes/:email" element={<SolicitacoesList />} />
          <Route path="/requests" element={<SolicitacoesList />} />
          <Route path="/requests/:email" element={<SolicitacoesList />} />
          
          <Route path="/solicitacoes/detalhes/:id" element={<SolicitacoesDetalhes />} />
          <Route path="/solicitacao/:id" element={<SolicitacoesDetalhes />} />
          <Route path="/request/details/:id" element={<SolicitacoesDetalhes />} />
          <Route path="/request/:id" element={<SolicitacoesDetalhes />} />

          {/* ✅ AUMIGOS */}
          <Route path="/aumigos" element={<AumigosList />} />
          <Route path="/friends" element={<AumigosList />} />

          {/* ✅ PÁGINA 404 - DEVE SER A ÚLTIMA ROTA */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

