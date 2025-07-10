import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "@/components/ui/card"

const anos = [
  {
    ano: "2022",
    desc: "Primeiro ano do projeto, artigo publicado em revista Qualis nível B1.",
  },
  {
    ano: "2023",
    desc: "Segundo ano do projeto, com segunda publicação de artigo em revista nacional, semi-finalistas na FEBRACE.",
  },
  {
    ano: "2024",
    desc: "Terceiro ano do projeto, participação na FEBIC com dois projetos premiados e finalistas na FENIC com um projeto selecionado.",
  },
]

export default function Timeline() {
  return (
    <section className="my-12">
      <h1 className="text-3xl md:text-5xl font-bold text-white font-poppins mb-8 text-center">
        História e Premiações
      </h1>
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
        {anos.map((item, idx) => (
          <Card
            key={item.ano}
            className="relative bg-[#29166380] border-0 shadow-xl rounded-2xl w-full md:w-96 flex-shrink-0"
          >
            <CardHeader className="flex flex-row items-center justify-center gap-2 pb-0">
              <CardTitle>
                <span className="bg-[#EE3EC9] text-white px-6 py-2 rounded-full text-2xl font-bold shadow">
                  {item.ano}
                </span>
              </CardTitle>
              {idx < anos.length - 1 && (
                // Linha horizontal para timeline visual em telas grandes
                <span className="hidden md:block h-1 w-8 bg-[#EE3EC9]/50 mx-2 rounded-full"></span>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-[#D8CBFF] text-base md:text-lg text-center mt-4">
                {item.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
