import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false); // Fecha o menu ao navegar
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Heart className="h-6 w-6 fill-primary" />
          <span className="hidden sm:inline">Casa da Dinda</span>
          <span className="sm:hidden">Casa Da Dinda</span>
        </Link>

        {/* Menu Desktop - Escondido no mobile */}
        <div className="hidden md:flex items-center gap-1">

          <Button variant="ghost" onClick={() => navigate("/aumigos")}>
            Aumigos
          </Button>

          <div className="h-6 w-px bg-border mx-2" />

          <Button variant="ghost" onClick={() => navigate("/lares")}>
            Ver Lares
          </Button>

          <div className="h-6 w-px bg-border mx-2" />

          <Button variant="ghost"  onClick={() => navigate("/cadastrar-lar")}>
            Cadastrar Lar
          </Button>

          <div className="h-6 w-px bg-border mx-2" />


          <Button variant="ghost" onClick={() => navigate("/solicitacoes-login")}>
            Solicitações
          </Button>

        </div>

        {/* Menu Hambúrguer Mobile - Visível apenas no mobile */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2 text-primary">
                  <Heart className="h-5 w-5 fill-primary" />
                  Casa da Dinda
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-3">

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigate("/aumigos")}
                >
                  Aumigos
                </Button>                
                
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigate("/lares")}
                >
                  Ver Lares
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigate("/cadastrar-lar")}
                >
                  Cadastrar Lar
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigate("/solicitacoes-login")}
                >
                  Solicitações
                </Button>

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

