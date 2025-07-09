import { Card, CardContent } from "@/components/ui/card" // shadcn/ui card
import Timeline from "@/components/ui/timeline"
import Team from '@/components/ui/team'


export default function About() {
  return (
    <div className="flex flex-col gap-12 px-6 py-8 max-w-7xl mx-auto">
      {/* Intro */}
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <img
          src="Elements/lamp.svg"
          alt="Lampada"
          className="rounded-2xl max-w-xs shadow-lg"
          width={320}
          height={320}
        />
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-4xl md:text-6xl font-bold text-right text-white font-poppins">O que é a Iniciação Científica?</h1>
          <p className="text-lg md:text-2xl text-right text-[#d8cbff] font-poppins font-medium">
            É um projeto organizado pela direção regional. São 10 grupos na Escola SESI, 3 Grupos na regional Sudeste e 10 estudantes por projeto.
          </p>
        </div>
      </div>

      {/* Missão, Valores, Organização */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card className="bg-[#29166380] shadow-xl">
          <CardContent className="flex flex-col items-center py-8 gap-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white underline underline-offset-8 decoration-[#EE3EC9]">Missão</h2>
            <p className="text-lg md:text-xl text-center text-[#D8CBFF] font-poppins font-medium">
              Incentivar e desenvolver o protagonismo juvenil por meio da pesquisa para promover uma cultura científica e tecnológica.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#29166380] shadow-xl">
          <CardContent className="flex flex-col items-center py-8 gap-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white underline underline-offset-8 decoration-[#EE3EC9]">Valores</h2>
            <p className="text-lg md:text-xl text-center text-[#D8CBFF] font-poppins font-medium">
              Posicionar nacionalmente a Escola SESI como formadora de excelência em perspectivas científicas e tecnológicas em todas as áreas do conhecimento.
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2 bg-[#29166380] shadow-xl">
          <CardContent className="flex flex-col md:flex-row justify-between items-center py-8 gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold text-white font-poppins">Organização</h2>
              <ul className="text-lg text-[#D8CBFF] mt-4 space-y-1 list-disc list-inside">
                <li>5 grupos com 3 estudantes.</li>
                <li>Auxílio de custo para os alunos.</li>
                <li>Carga horária semanal.</li>
                <li>Produção de artigo científico.</li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <img
                src="Team/Grupo.jpg"
                width={390}
                height={320}
                alt="Grupo"
                className="rounded-2xl shadow-lg max-w-xs md:max-w-md"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico e Integrantes */}
      <div className="mt-16 flex flex-col gap-16">
        <Timeline />
        <Team />
      </div>
    </div>
  )
}
