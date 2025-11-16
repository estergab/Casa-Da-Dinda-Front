import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Phone, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import { aumigosData, Aumigo } from "@/lib/aumigosData";

const AumigosList = () => {
  const navigate = useNavigate();

  const getTypeBadge = (type: Aumigo["type"]) => {
    const badges = {
      ong: { label: "ONG", variant: "default" as const },
      abrigo: { label: "Abrigo", variant: "secondary" as const },
      clinica: { label: "Clínica Popular", variant: "outline" as const },
      petshop: { label: "Pet Shop", variant: "secondary" as const },
      veterinario: { label: "Veterinário", variant: "default" as const },
    };
    return badges[type];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            🐾 Aumigos da Comunidade
          </h1>
          <p className="text-muted-foreground text-lg">
            Conheça ONGs, abrigos, clínicas populares e outras entidades que promovem o bem-estar animal
          </p>
        </div>

        {/* Lista de Aumigos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aumigosData.map((aumigo) => {
            const badge = getTypeBadge(aumigo.type);
            
            return (
              <Card key={aumigo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Imagem */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={aumigo.imageUrl}
                    alt={aumigo.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{aumigo.name}</CardTitle>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    {aumigo.city}, {aumigo.state}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {aumigo.description}
                  </p>

                  {/* Contatos */}
                  <div className="mt-4 space-y-2">
                    {aumigo.phone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{aumigo.phone}</span>
                      </div>
                    )}
                    {aumigo.email && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{aumigo.email}</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => window.open(aumigo.website, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visitar Site
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Empty State (caso precise no futuro) */}
        {aumigosData.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">
                Nenhuma entidade cadastrada ainda.
              </p>
              <Button onClick={() => navigate("/")}>
                Voltar para Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AumigosList;
