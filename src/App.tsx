import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

          {/* ✅ CADASTRO DE LAR */}
          <Route path="/cadastrar" element={<RegisterHome />} />

          {/* ✅ LARES - LISTAGEM E DETALHES */}
          <Route path="/lares" element={<HomesList />} />
          <Route path="/lar/:id" element={<HomeDetails />} />
          <Route path="/editar/:id" element={<EditHome />} />
          <Route path="/solicitar/:id" element={<RequestStay />} />

          {/* ✅ SOLICITAÇÕES */}
          <Route path="/solicitacoes-login" element={<SolicitacoesLogin />} />
          <Route path="/solicitacoes/:email" element={<SolicitacoesList />} />
          <Route path="/solicitacoes/detalhes/:id" element={<SolicitacoesDetalhes />} /> {/* ✅ CORRIGIDO */}

          {/* ✅ AUMIGOS */}
          <Route path="/aumigos" element={<AumigosList />} />

          {/* ✅ PÁGINA 404 - DEVE SER A ÚLTIMA ROTA */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
