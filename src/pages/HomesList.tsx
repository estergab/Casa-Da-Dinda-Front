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

  // ESTADOS DOS FILTROS
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedPetType, setSelectedPetType] = useState<string>("all");

  // LISTAS ÚNICAS DE CIDADES
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/lares");
        console.log("✅ Response completa:", response);
        console.log("✅ Response.data:", response.data);

        const laresData = response.data.data || response.data;
        console.log("✅ Lares recebidos:", laresData);

        if (!Array.isArray(laresData)) {
          console.error("❌ Lares não é um array:", laresData);
          toast.error("Erro ao carregar lares");
          return;
        }

        // Mapear para o formato esperado
        const homesMapped: TemporaryHome[] = laresData.map((lar: any) => ({
          id: lar._id || lar.id,
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
          availableFor: Array.isArray(lar.availableFor)
            ? lar.availableFor
            : typeof lar.availableFor === "string"
            ? [lar.availableFor]
            : [],
          description: lar.description || "",
          imageUrl: lar.imageUrl || "/placeholder.svg",
          createdAt: lar.createdAt ? new Date(lar.createdAt) : new Date(),
        }));

        console.log("✅ Homes mapeados:", homesMapped);
        setHomes(homesMapped);
        setFilteredHomes(homesMapped);

        // Extrair cidades únicas
        const uniqueCities = [
          ...new Set(homesMapped.map((h) => h.city).filter(Boolean)),
        ].sort();
        setCities(uniqueCities);
      } catch (error: any) {
        console.error("❌ Erro ao carregar lares:", error);
        toast.error("Erro ao carregar lares");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomes();
  }, []);

  // APLICAR FILTROS
  useEffect(() => {
    let filtered = [...homes];

    // Filtro por cidade
    if (selectedCity !== "all") {
      filtered = filtered.filter((home) => home.city === selectedCity);
    }

    // Filtro por tipo de pet
    if (selectedPetType !== "all") {
      filtered = filtered.filter((home) =>
        home.availableFor.some((type) =>
          type.toLowerCase().includes(selectedPetType.toLowerCase())
        )
      );
    }

    setFilteredHomes(filtered);
  }, [selectedCity, selectedPetType, homes]);

  const clearFilters = () => {
    setSelectedCity("all");
    setSelectedPetType("all");
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold mb-2">Lares Temporários</h1>
            <p className="text-gray-600">
              Encontre o lar perfeito para seu pet resgatado
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Exibindo <strong>{filteredHomes.length}</strong> de{" "}
            <strong>{homes.length}</strong> lares
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <h2 className="font-semibold">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Cidade */}
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

            {/* Filtro por Tipo de Pet */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tipo de Pet
              </label>
              <Select value={selectedPetType} onValueChange={setSelectedPetType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="cães">Cães</SelectItem>
                  <SelectItem value="gatos">Gatos</SelectItem>
                  <SelectItem value="filhotes">Filhotes</SelectItem>
                  <SelectItem value="grande porte">Grande Porte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botão Limpar Filtros */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>

          {/* Filtros Ativos */}
          {(selectedCity !== "all" || selectedPetType !== "all") && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              {selectedCity !== "all" && (
                <Badge variant="secondary">
                  {selectedCity}
                  <button
                    onClick={() => setSelectedCity("all")}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedPetType !== "all" && (
                <Badge variant="secondary">
                  {selectedPetType}
                  <button
                    onClick={() => setSelectedPetType("all")}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Lista de Lares */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando lares...</p>
          </div>
        ) : filteredHomes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {homes.length === 0
                ? "Nenhum lar temporário cadastrado ainda."
                : "Nenhum lar encontrado com os filtros selecionados."}
            </p>
            {homes.length > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHomes.map((home) => (
              <HomeCard key={home.id} home={home} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomesList;

