"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BadgeX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const IA = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [processingMessage, setProcessingMessage] = useState("");
  const [vehicleCounts, setVehicleCounts] = useState<{ [key: string]: number }>({});
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const [heavyVehiclePercentage, setHeavyVehiclePercentage] = useState<number>(0);

  return (
    <div className="flex flex-col justify-center items-center p-5 min-h-screen">
      <h1 className="font-poppins text-[1.8em] text-white mb-6 drop-shadow">Inteligência Artificial</h1>
      <Card>
      <CardContent>
        <Alert className="w-auto mb-5" variant="destructive">
          <BadgeX />
          <AlertTitle>Faça Login!</AlertTitle>
          <AlertDescription>
            Faça Login ou cadastre-se para ter acesso a inteligência artificial.
          </AlertDescription>
        </Alert>
        <div className="flex flex-col bg-[#9a9a9a] w-[440px] h-[300px] rounded-xl p-5 items-center overflow-y-auto gap-4">
          <p className="text-[#444] text-[1.2em] font-poppins text-center">Clique abaixo para enviar o vídeo:</p>
          
          <label
            htmlFor="videoUpload"
            className="w-[170px] h-[70px] border-2 border-[#545454] bg-[#dadada] text-black font-poppins text-center text-[1.4em] rounded-lg flex justify-center items-center mt-2 cursor-pointer transition-all hover:bg-[#b3b3b3] hover:scale-110"
          >
            Selecionar Vídeo
          </label>
          <input
            id="videoUpload"
            type="file"
            accept="video/*"
            className="hidden"
          />

          <Button
            className="w-[170px] h-[70px] border-2 border-[#545454] bg-[#dadada] text-black font-poppins text-center text-[1.4em] rounded-lg flex justify-center items-center mt-2 cursor-pointer transition-all hover:bg-[#b3b3b3] hover:scale-110"
          >
            Enviar
          </Button>

          <p>{uploadMessage}</p>
          <p>{processingMessage}</p>

          
          {totalVehicles > 0 && (
            <div className="mt-2 w-full bg-[#ececec] rounded-xl p-5 text-center flex flex-col items-center">
              <h2 className="font-poppins text-[1.4em] text-[#333] mb-2">Resultados da Contagem:</h2>
              <ul className="list-none p-0 m-0 w-full">
                <li className="font-poppins text-[1.1em] text-[#222] my-1 text-left">carro: 12</li>
                <li className="font-poppins text-[1.1em] text-[#222] my-1 text-left">ônibus: 2</li>
              </ul>
              <p className="font-poppins text-[1em] text-[#111] mt-2">🚗 Total de veículos: {totalVehicles}</p>
              <p className="font-poppins text-[1em] text-[#111] mt-2">🚚 Percentual de veículos pesados: {heavyVehiclePercentage.toFixed(2)}%</p>
              <a
                href="#"
                className="inline-block mt-4 px-6 py-2 bg-[#dadada] border-2 border-[#545454] text-black font-poppins text-[1.1em] rounded-lg no-underline transition-all hover:bg-[#b3b3b3] hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                📥 Baixar Vídeo Processado
              </a>
            </div>
          )}
        </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IA;
