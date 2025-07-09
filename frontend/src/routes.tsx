// src/routes.tsx
import { Routes, Route } from "react-router-dom"
import Home from "./app/pages/Home"
import About from "./app/pages/About"
import Library from "./app/pages/Library"
import ChapterPage from "./components/ui/Library/chapterPage"
import Calculator from "./app/pages/Calculator"
import IA from "./app/pages/AI"
import Contact from "./app/pages/Contact"
import Perfil from "./app/pages/Perfil"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/About" element={<About />} />
      <Route path="/Library" element={<Library />} />
      <Route path="/chapters/:id" element={<ChapterPage />} />
      <Route path="/Calculator" element={<Calculator />} />
      <Route path="/IA" element={<IA />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/Perfil" element={<Perfil />} />
    </Routes>
  )
}
