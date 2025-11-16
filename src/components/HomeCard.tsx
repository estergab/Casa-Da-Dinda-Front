import { MapPin, Home, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TemporaryHome } from "@/lib/mockData";
import { getUploadUrl } from "@/config/api"; // ✅ ADICIONAR ESTA LINHA

interface HomeCardProps {
  home: TemporaryHome;
}

const HomeCard = ({ home }: HomeCardProps) => {
  // Validação de segurança
  if (!home || !home.availableFor) {
    console.error("❌ HomeCard recebeu dados inválidos:", home);
    return null;
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagem do Lar */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getUploadUrl(home.imageUrl)} // ✅ ALTERAR ESTA LINHA
          alt={`Casa de ${home.hostName}`}
          className="w-full h-full object-cover"
        />
        {home.hasYard && (
          <Badge className="absolute top-2 right-2 bg-green-500">
            Com Quintal
          </Badge>
        )}
      </div>

      {/* Conteúdo */}
      <CardContent className="p-4 space-y-3">
        <h3 className="text-xl font-semibold">Casa de {home.hostName}</h3>

        <div className="flex items-center text-gray-600 gap-2">
          <MapPin className="h-4 w-4" />
          <span>{home.city}, {home.state}</span>
        </div>

        <div className="flex items-center text-gray-600 gap-2">
          <Users className="h-4 w-4" />
          <span>Até {home.capacity} pets</span>
        </div>

        {/* Características */}
        <div className="flex gap-2 flex-wrap">
          {home.hasYard && (
            <Badge variant="secondary">
              <Home className="h-3 w-3 mr-1" />
              Quintal
            </Badge>
          )}
          {home.hasFence && (
            <Badge variant="secondary">Cercado</Badge>
          )}
        </div>

        {/* Aceita */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Aceita:</p>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(home.availableFor) && home.availableFor.length > 0 ? (
              home.availableFor.map((type, index) => (
                <Badge key={index} variant="outline">
                  {type}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-400">Não especificado</span>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/lar/${home.id}`}>Ver Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HomeCard;
