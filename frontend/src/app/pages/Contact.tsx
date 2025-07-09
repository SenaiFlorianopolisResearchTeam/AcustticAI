import React from "react";
import { Github, Linkedin } from "lucide-react";

const membrosAntigos = [
  {
    nome: "Ana Beatriz Martins",
    linkedin: "https://www.linkedin.com/in/anabe-sc/",
    github: "https://github.com/anabmartins",
  },
  {
    nome: "Yuri Castilho",
    linkedin: "https://www.linkedin.com/in/yuri-castilhoo/",
    github: "https://github.com/YuriCast",
  },
  {
    nome: "Isadora Wenzel",
    linkedin: "https://www.linkedin.com/in/isadora-ws/",
    github: "https://github.com/isaws06",
  },
];

const membrosNovos = [
  {
    nome: "Pedro Zanette",
    linkedin: "https://www.linkedin.com/in/pedro-henrique-nunes-zanette-254175269/",
    github: "https://github.com/PedroZanette",
  },
  {
    nome: "Vítor Kurth",
    linkedin: "https://www.linkedin.com/in/v%C3%ADtor-kurth/",
    github: "https://github.com/VITOR-KURTH",
  },
  {
    nome: "Sara Pereira",
    linkedin: "https://www.linkedin.com/in/sara-rotenski-33b6a32b9/",
    github: "https://github.com/sararotenski",
  },
];

const Contact: React.FC = () => {
  return (
    <div className="main block min-h-screen bg-gradient-to-b from-[#16003b] to-[#291663] p-4">
      <h1 className="title text-[72px] text-white/65 text-left ml-[3%] font-bold mb-4 md:mb-10 font-poppins">
        Contato
      </h1>
      <h2 className="titleMembers text-xl md:text-2xl font-bold text-white/75 mb-4 ml-[3.3%]">
        Antigos membros
      </h2>
      <div className="container grid grid-cols-1 md:grid-cols-3 justify-center gap-y-10 gap-x-8 mt-20 mb-32 place-content-center">
        {membrosAntigos.map((m) => (
          <div
            key={m.nome}
            className="member flex flex-col items-center justify-center gap-2"
          >
            <h3 className="text-white/65 text-center text-lg font-semibold px-2">
              {m.nome}
            </h3>
            <div className="div flex gap-2">
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7900FF] rounded px-2 py-1 hover:bg-[#5415a0] transition"
              >
                <Linkedin size={32} className="text-white" />
              </a>
              <a
                href={m.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7900FF] rounded px-2 py-1 hover:bg-[#5415a0] transition"
              >
                <Github size={32} className="text-white" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <h2 className="titleMembers text-xl md:text-2xl font-bold text-white/75 mb-4 ml-[3.3%]">
        Novos membros
      </h2>
      <div className="container grid grid-cols-1 md:grid-cols-3 justify-center gap-y-10 gap-x-8 mt-10 mb-24 place-content-center">
        {membrosNovos.map((m) => (
          <div
            key={m.nome}
            className="member flex flex-col items-center justify-center gap-2"
          >
            <h3 className="text-white/65 text-center text-lg font-semibold px-2">
              {m.nome}
            </h3>
            <div className="div flex gap-2">
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7900FF] rounded px-2 py-1 hover:bg-[#5415a0] transition"
              >
                <Linkedin size={32} className="text-white" />
              </a>
              <a
                href={m.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7900FF] rounded px-2 py-1 hover:bg-[#5415a0] transition"
              >
                <Github size={32} className="text-white" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
