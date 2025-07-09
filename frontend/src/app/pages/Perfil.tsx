import React from "react";

const Perfil = () => {
  // Dados mock para exemplo, remova em produção
  const usuario = { nome_usuario: "Seu Nome", email_usuario: "email@dominio.com" };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 bg-gradient-to-b from-[#16003b] to-[#291663]">
      <div className="flex flex-col lg:flex-row items-center gap-24 w-full max-w-6xl p-4">
        {/* Box do perfil */}
        <div className="w-[340px] md:w-[500px] lg:w-[800px] flex flex-col items-center justify-center border border-[#451892] rounded-xl bg-gradient-to-b from-[#45189270] to-[#120234] shadow-xl p-6">
          <h1 className="text-[2.2rem] md:text-[2.8rem] text-center text-white/95 mt-4 font-bold font-poppins">
            Bem-vindo, {usuario.nome_usuario}!
          </h1>
          <div className="bg-transparent rounded-lg mt-4 mb-6 px-4 py-2 w-full flex flex-col items-center">
            <p className="text-xl md:text-2xl text-white my-2">
              <strong>Nome:</strong> {usuario.nome_usuario}
            </p>
            <p className="text-lg md:text-xl text-white bg-[#120234] px-4 py-2 rounded-lg my-2">
              <strong>Email:</strong> {usuario.email_usuario}
            </p>
          </div>
          <div className="flex gap-5 mt-4">
            <button
              className="w-[100px] h-[40px] bg-red-600 hover:bg-blue-700 text-white text-lg rounded-lg shadow transition mb-3"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
