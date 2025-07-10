import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion"

import Wagner from '../../../public/Team/Wawa.jpg'
import Pedro from '../../../public/Team/Pedro.jpg'
import Sara from '../../../public/Team/Sara.jpg'
import VitorK from '../../../public/Team/VitorK.jpg'

const grupos = [
  {
    nome: "Orientador",
    pdf: null,
    integrantes: [
      {
        id: 1,
        nome: "Wagner de Souza Santos",
        funcao: "Orientador",
        foto: Wagner,
      },
    ],
  },
  {
    nome: "Grupo 1: DESENVOLVIMENTO DE UMA PLATAFORMA INTEGRADA PARA ANÁLISE DOS NÍVEIS DE RUÍDO RODOVIÁRIO",
    pdf: "/IA.pdf",
    integrantes: [
      {
        id: 2,
        nome: "Pedro Henrique Nunes Zanette",
        funcao: "Desenvolvedor",
        foto: Pedro,
      },
      {
        id: 3,
        nome: "Sara Rotenski Pereira",
        funcao: "Desenvolvedora",
        foto: Sara,
      },
      {
        id: 4,
        nome: "Vítor Kurth Vasconcellos Ferreira",
        funcao: "Desenvolvedor",
        foto: VitorK,
      },
    ],
  },
  // ...demais grupos (copie do seu código)
]

export default function Integrantes() {
  return (
    <section className="bg-[#241358]/60 rounded-2xl shadow-xl py-10 px-4 md:px-16 mb-8">
      <h1 className="text-3xl md:text-5xl font-bold text-white font-poppins mb-8 text-center">
        Grupos e Integrantes
      </h1>
      <Accordion type="multiple" className="w-full">
        {grupos.map((grupo, idx) => (
          <AccordionItem key={grupo.nome} value={grupo.nome} className="bg-[#29166380] rounded-xl shadow-md px-4 py-2 mb-4">
            <AccordionTrigger className="text-lg md:text-xl font-bold text-[#EE3EC9]">
              {grupo.nome}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {grupo.integrantes.map((integrante) => (
                  <div
                    key={integrante.id}
                    className="bg-[#31206C]/80 rounded-xl shadow flex flex-col items-center p-6"
                  >
                    <img
                      src={integrante.foto}
                      alt={`Foto de ${integrante.nome}`}
                      className="rounded-full w-28 h-28 object-cover mb-4 border-4 border-[#EE3EC9]"
                    />
                    <h3 className="text-lg font-bold text-white mb-1">{integrante.nome}</h3>
                    <p className="text-[#D8CBFF] font-medium">{integrante.funcao}</p>
                  </div>
                ))}
              </div>
              {grupo.pdf && (
                <div className="flex justify-end mt-4">
                  <a
                    href={grupo.pdf}
                    download
                    className="inline-block bg-[#EE3EC9] text-white px-5 py-2 rounded-lg font-bold transition hover:bg-[#bc2e93]"
                  >
                    Baixar PDF
                  </a>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
