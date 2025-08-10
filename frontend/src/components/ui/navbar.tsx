"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Button } from "./button";
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const debugToken = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      });
      console.log("ACCESS TOKEN:", token);
    } catch (err) {
      console.error("Erro ao pegar token:", err);
    }
  };

   const chamarAPIPrivada = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      });

      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/private`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${txt}`);
      }

      const data = await resp.json();
      console.log("RESPOSTA /api/private:", data);
      alert(`OK!\nsub: ${data.sub}\nemail: ${data.email ?? "sem email"}`);
    } catch (err) {
      console.error("Falha ao chamar /api/private:", err);
      alert("Erro ao chamar API privada. Veja o console.");
    }
  };

  return (
    <header className="w-full mt-5 mb-0 md:px-6 flex items-center justify-between font-poppins text-white">
      <div className="flex items-center">
        <Link to="/Home">
          <img src="Elements/LogoIC.svg" alt="Logo" width={120} />
        </Link>
      </div>

      <NavigationMenu className="w-full max-w-none justify-end">
        <NavigationMenuList className="flex gap-6 font-bold text-lg">
          {[
            { title: "Home", url: "/Home" },
            { title: "Sobre", url: "/About" },
            { title: "Biblioteca", url: "/Library" },
            { title: "Contato", url: "/Contact" },
          ].map((link) => (
            <NavigationMenuItem key={link.url}>
              <Link to={link.url}>
                <NavigationMenuLink className="cursor-pointer hover:text-[#FFBCF1] transition-colors">
                  {link.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}

          {isAuthenticated && (
            <>
              <NavigationMenuItem>
                <Link to="/Calculator">
                  <NavigationMenuLink className="cursor-pointer hover:text-[#FFBCF1] transition-colors">
                    Calculadora
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/IA">
                  <NavigationMenuLink className="cursor-pointer hover:text-[#FFBCF1] transition-colors">
                    Inteligência Artificial
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </>
          )}

          <NavigationMenuItem>
            <div className="flex flex-row">
              {isLoading ? (
                <span className="text-white">Carregando...</span>
              ) : isAuthenticated ? (
                <div className="flex flex-row items-center md:items-start gap-5">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.picture} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0) ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white text-base">{user?.name}</span>
                  </div>
                  <Button
                    onClick={() =>
                      logout({
                        logoutParams: { returnTo: window.location.origin },
                      })
                    }
                    variant="destructive"
                    className="h-8 px-5 text-base cursor-pointer"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() =>
                    loginWithRedirect({
                      authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                        scope: "openid profile email",
                      },
                    })
                  }
                  className="h-10 w-30 text-ls text-black cursor-pointer"
                  variant="secondary"
                >
                  Login
                </Button>
              )}
            </div>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
