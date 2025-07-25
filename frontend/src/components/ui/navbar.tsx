'use client'
 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"

export function Navbar() {
  return (
    <header className="w-full mt-5 mb-0 md:px-6 flex items-center justify-between font-poppins text-white">
      <div className="flex items-center">
        <Link to='/Home'>
        <img src="Elements/LogoIC.svg" alt="Logo" width={120} />
        </Link>
      </div>

      <NavigationMenu className="w-full max-w-none justify-end">
        <NavigationMenuList className="flex gap-6 font-bold text-lg">
          {[
            { title: "Home", url: "/Home" },
            { title: "Sobre", url: "/About" },
            { title: "Biblioteca", url: "/Library" },
            { title: "Calculadora", url: "/Calculator" },
            { title: "Inteligência Artificial", url: "/IA" },
            { title: "Contato", url: "/Contact" }
          ].map((link) => (
            <NavigationMenuItem key={link.url}>
              <Link to={link.url}>
                <NavigationMenuLink className="cursor-pointer hover:text-[#FFBCF1] transition-colors">
                  {link.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}

          <NavigationMenuItem>
            <Link to="/Login">
              <NavigationMenuLink className="cursor-pointer hover:text-[#FFBCF1] transition-colors">
              <Avatar>
                <AvatarImage/>
                <AvatarFallback>IC</AvatarFallback>
              </Avatar>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}
