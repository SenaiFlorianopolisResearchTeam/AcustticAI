import { useParams } from "react-router-dom"
import { caps } from "./caps" // ajuste o caminho conforme necessário
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function ChapterPage() {
  const { id } = useParams()
  const chapter = caps.find(c => String(c.id) === String(id))

  if (!chapter) {
    return (
      <div className="w-full max-w-3xl mx-auto text-center mt-20 text-2xl text-red-300 font-bold">
        Capítulo não encontrado.
      </div>
    )
  }

  return (
    <section className="w-full max-w-3xl mx-auto py-12 px-4">
      <Card className="bg-[#29166380] border-0 rounded-2xl shadow-2xl p-0">
        <CardHeader className="pb-2 flex flex-col items-start gap-2">
          <Link
            to="/Library"
            className="flex items-center gap-2 text-[#EE3EC9] hover:underline mb-2 text-base font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Biblioteca
          </Link>
          <CardTitle className="text-white text-3xl md:text-4xl font-bold font-poppins">
            {chapter.title}
          </CardTitle>
          <CardDescription className="text-[#EE3EC9] text-xl md:text-2xl font-poppins">
            {chapter.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-6">
          <div className="space-y-4 text-lg text-[#d8cbff] font-poppins leading-relaxed">
            {chapter.paragraphs.map((p, i) => (
              <p key={i} className="indent-6">
                {p}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
