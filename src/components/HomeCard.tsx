import { MapPin, Home, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TemporaryHome } from "@/lib/mockData";

interface HomeCardProps {
  home: TemporaryHome; // ✅ RECEBER O OBJETO COMPLETO
}

const HomeCard = ({ home }: HomeCardProps) => {
  // Validação de segurança
  if (!home || !home.availableFor) {
    console.error("❌ HomeCard recebeu dados inválidos:", home);
    return null;
  }

  return (
    <Link to={`/lares/${home.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Imagem do Lar */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={home.imageUrl}
            alt={`Lar de ${home.hostName}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {home.hasYard && (
            <Badge
              className="absolute top-2 right-2 bg-green-500 hover:bg-green-600"
            >
              Com Quintal
            </Badge>
          )}
        </div>

        {/* Conteúdo */}
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Home className="h-4 w-4 text-primary" />
            Casa de {home.hostName}
          </h3>

          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {home.city}, {home.state}
          </div>

          <div className="flex items-center text-sm mb-3">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            Até {home.capacity} pets
          </div>

          {/* Características */}
          <div className="flex gap-2 flex-wrap mb-3">
            {home.hasYard && (
              <Badge variant="secondary">Quintal</Badge>
            )}
            {home.hasFence && (
              <Badge variant="secondary">Cercado</Badge>
            )}
          </div>

          {/* Aceita */}
          <div className="flex gap-2 flex-wrap">
            {Array.isArray(home.availableFor) && home.availableFor.length > 0 ? (
              home.availableFor.map((type, index) => (
                <Badge key={index} variant="outline">
                  {type}
                </Badge>
              ))
            ) : (
              <Badge variant="outline">Não especificado</Badge>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0">
          <Button className="w-full gradient-primary" asChild>
            <span>Ver Detalhes</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default HomeCard;
