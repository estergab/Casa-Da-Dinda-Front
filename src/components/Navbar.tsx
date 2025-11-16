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
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Heart className="h-6 w-6 text-orange-500 fill-orange-500" />
            <span className="text-xl font-bold text-gray-800">Casa Da Dinda</span>
          </Link>

          {/* Menu Desktop - Escondido no mobile */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/aumigos")}>
              Aumigos
            </Button>
            <Button variant="ghost" onClick={() => navigate("/lares")}>
              Ver Lares
            </Button>
            <Button variant="ghost" onClick={() => navigate("/cadastrar-lar")}>
              Cadastrar Lar
            </Button>
            <Button variant="ghost" onClick={() => navigate("/solicitacoes-login")}>
              Solicitações
            </Button>
          </div>

          {/* Menu Hambúrguer Mobile - Visível apenas no mobile */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-orange-500 fill-orange-500" />
                    Casa da Dinda
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleNavigate("/aumigos")}
                  >
                    Aumigos
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleNavigate("/lares")}
                  >
                    Ver Lares
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleNavigate("/cadastrar-lar")}
                  >
                    Cadastrar Lar
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleNavigate("/solicitacoes-login")}
                  >
                    Solicitações
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

