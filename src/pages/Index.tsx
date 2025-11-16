import { Link } from "react-router-dom";
import { Heart, Home, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-pets.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Pets felizes em um lar acolhedor"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="bg-primary rounded-full p-6 shadow-hover">
                <Heart className="h-16 w-16 text-primary-foreground" fill="currentColor" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">
              Casa da Dinda
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Conectando pets resgatados com lares acolhedores. 
              Cada animal merece uma segunda chance.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                size="lg" 
                asChild 
                className="gradient-primary border-0 shadow-soft hover:shadow-hover transition-smooth text-lg px-8 py-6"
              >
                <Link to="/lares" className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Procurar um Lar Temporário
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6 transition-smooth"
              >
                <Link to="/cadastrar-lar" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Cadastrar Meu Lar Temporário
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Como Funciona
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-card hover:shadow-hover transition-smooth">
              <CardContent className="p-6 text-center space-y-4">
                <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Cadastre Seu Lar</h3>
                <p className="text-muted-foreground">
                  Preencha um formulário simples com informações sobre sua casa e disponibilidade.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-hover transition-smooth">
              <CardContent className="p-6 text-center space-y-4">
                <div className="bg-secondary/10 rounded-full p-4 w-fit mx-auto">
                  <Search className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Encontre o Lar Ideal</h3>
                <p className="text-muted-foreground">
                  Navegue pelos lares disponíveis e encontre o mais adequado para seu pet resgatado.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-hover transition-smooth">
              <CardContent className="p-6 text-center space-y-4">
                <div className="bg-accent/10 rounded-full p-4 w-fit mx-auto">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Salve uma Vida</h3>
                <p className="text-muted-foreground">
                  Conecte-se com anfitriões e proporcione um lar temporário seguro e amoroso.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
