import React, { useEffect, useState } from "react";
import { ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HomeCard from "@/components/HomeCard";
import Navbar from "@/components/Navbar";
import { TemporaryHome } from "@/lib/mockData";
import api from "@/services/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const HomesList = () => {
  const navigate = useNavigate();
  const [homes, setHomes] = useState<TemporaryHome[]>([]);
  const [filteredHomes, setFilteredHomes] = useState<TemporaryHome[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ ESTADOS DOS FILTROS
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedPetType, setSelectedPetType] = useState<string>("all");

  // ✅ LISTAS ÚNICAS DE CIDADES
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/lares");

        console.log("✅ Response completa:", response);
        console.log("✅ Response.data:", response.data);

        let laresData = [];
        if (response.data && response.data.data) {
          laresData = response.data.data;
        } else if (Array.isArray(response.data)) {
          laresData = response.data;
        }

        console.log("✅ Lares extraídos:", laresData);

        if (!Array.isArray(laresData) || laresData.length === 0) {
          console.warn("⚠️ Nenhum lar encontrado");
          setHomes([]);
          setFilteredHomes([]);
          return;
        }

        const homesFormatted: TemporaryHome[] = laresData.map((lar: any) => {
          console.log("📦 Mapeando lar:", lar);
          return {
            id: lar._id || lar.id || "",
            hostName: lar.hostName || "",
            email: lar.email || "",
            phone: lar.phone || "",
            city: lar.city || "",
            state: lar.state || "",
            address: lar.address || "",
            capacity: lar.capacity || 0,
            hasYard: lar.hasYard || false,
            hasFence: lar.hasFence || false,
            experience: lar.experience || "",
            availableFor: Array.isArray(lar.availableFor) ? lar.availableFor : [],
            description: lar.description || "",
            imageUrl: lar.imageUrl
              ? `http://localhost:3335${lar.imageUrl}`
              : "/placeholder.svg",
            createdAt: lar.createdAt ? new Date(lar.createdAt) : new Date(),
          };
        });

        console.log("✅ Lares formatados:", homesFormatted);
        setHomes(homesFormatted);
        setFilteredHomes(homesFormatted);

        // ✅ EXTRAIR CIDADES ÚNICAS
        const uniqueCities = Array.from(
          new Set(homesFormatted.map((home) => home.city).filter(Boolean))
        ).sort();
        setCities(uniqueCities);
      } catch (error: any) {
        console.error("❌ Erro ao carregar lares:", error);
        console.error("❌ Erro detalhado:", error.response?.data);
        toast.error("Erro ao carregar lares. Tente novamente.");
        setHomes([]);
        setFilteredHomes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomes();
  }, []);

  // ✅ APLICAR FILTROS - VERSÃO CORRIGIDA
  useEffect(() => {
    let filtered = homes;

    // Filtro por cidade
    if (selectedCity !== "all") {
      filtered = filtered.filter(
        (home) => home.city.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    // ✅ FILTRO POR TIPO DE PET - CORRIGIDO
    if (selectedPetType !== "all") {
      // Mapear valor do frontend para valor do banco
      const petTypeMap: { [key: string]: string } = {
        "dog": "Cães",
        "cat": "Gatos",
        "large-dog": "Cães de Grande Porte",
        "puppy": "Filhotes",
      };

      const petTypeInDB = petTypeMap[selectedPetType];

      console.log("🔍 Filtro selecionado:", selectedPetType);
      console.log("🔍 Buscando no banco:", petTypeInDB);

      filtered = filtered.filter((home) => {
        console.log("🏠 Lar:", home.hostName, "| Aceita:", home.availableFor);
        return home.availableFor.some((type) => type === petTypeInDB);
      });
    }

    console.log("✅ Lares filtrados:", filtered.length);
    setFilteredHomes(filtered);
  }, [selectedCity, selectedPetType, homes]);

  // ✅ LIMPAR FILTROS
  const handleClearFilters = () => {
    setSelectedCity("all");
    setSelectedPetType("all");
  };

  const hasActiveFilters = selectedCity !== "all" || selectedPetType !== "all";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Lares Temporários
          </h1>
          <p className="text-muted-foreground text-lg">
            Encontre o lar perfeito para seu pet resgatado
          </p>
        </div>

        {/* ✅ FILTROS - SEM FUNDO VERDE */}
        <div className="mb-6 p-4 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Filtros</h2>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                Ativos
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro de Cidade */}
            <div>
              <label className="text-sm font-medium mb-2 block">Cidade</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as cidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Tipo de Pet */}
            <div>
              <label className="text-sm font-medium mb-2 block">Aceita</label>
              <Select value={selectedPetType} onValueChange={setSelectedPetType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="dog">Cães</SelectItem>
                  <SelectItem value="cat">Gatos</SelectItem>
                  <SelectItem value="large-dog">Cães de Grande Porte</SelectItem>
                  <SelectItem value="puppy">Filhotes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botão Limpar Filtros */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>

          {/* Resultados */}
          <p className="text-sm text-muted-foreground mt-4">
            Exibindo <strong>{filteredHomes.length}</strong> de{" "}
            <strong>{homes.length}</strong> lares
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Carregando lares...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredHomes.length === 0 && homes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              Nenhum lar temporário cadastrado ainda.
            </p>
            <Button onClick={() => navigate("/cadastrar-lar")} size="lg">
              Cadastrar Primeiro Lar
            </Button>
          </div>
        )}

        {/* Nenhum resultado com filtros */}
        {!isLoading && filteredHomes.length === 0 && homes.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              Nenhum lar encontrado com os filtros selecionados.
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Lista de Lares */}
        {!isLoading && filteredHomes.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHomes.map((home) => (
                <HomeCard key={home.id} home={home} />
              ))}
            </div>

            <div className="mt-8 text-center">
              {/* <Button
                onClick={() => navigate("/cadastrar-lar")}
                size="lg"
                className="gradient-primary"
              >
                Cadastrar Novo Lar
              </Button> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomesList;
