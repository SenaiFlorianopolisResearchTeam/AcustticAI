import React, { useState, useEffect } from "react"
import {
  calcHanc,
  calcJohnson,
  calcGalloway,
  calcBurgess,
  calcGriffiths,
  calcFagotti,
  calcBolt,
  calcCstb,
} from "./model"

const models = [
  { value: "hanc", label: "Hanc" },
  { value: "johnson", label: "Johnson" },
  { value: "galloway", label: "Galloway" },
  { value: "burgess", label: "Burgess" },
  { value: "griffiths", label: "Griffiths" },
  { value: "fagotti", label: "Fagotti" },
  { value: "bolt", label: "Bolt" },
  { value: "cstb", label: "CSTB" },
]

export default function Calculator() {
  const [selectedModel, setSelectedModel] = useState("hanc")
  const [modelValues, setModelValues] = useState({
    param1: "",
    param2: "",
    param3: "",
    param4: "",
  })
  const [result, setResult] = useState({
    l10: "",
    l50: "",
    l90: "",
    leq: "",
  })

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value)
    setModelValues({
      param1: "",
      param2: "",
      param3: "",
      param4: "",
    })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setModelValues({
      ...modelValues,
      [name]: value,
    })
  }

  useEffect(() => {
    const newResults = { l10: "", l50: "", l90: "", leq: "" }
    const numericModelValues = {
      param1: parseFloat(modelValues.param1) || 0,
      param2: parseFloat(modelValues.param2) || 0,
      param3: parseFloat(modelValues.param3) || 0,
      param4: parseFloat(modelValues.param4) || 0,
    }

    if (selectedModel === "hanc") {
      newResults.l50 = calcHanc(numericModelValues)
    } else if (selectedModel === "johnson") {
      newResults.l50 = calcJohnson(numericModelValues)
    } else if (selectedModel === "galloway") {
      newResults.l50 = calcGalloway(numericModelValues)
    } else if (selectedModel === "burgess") {
      newResults.l50 = calcBurgess(numericModelValues)
    } else if (selectedModel === "griffiths") {
      const griffithsResults = calcGriffiths(numericModelValues)
      newResults.l10 = griffithsResults.l10
      newResults.l50 = griffithsResults.l50
      newResults.l90 = griffithsResults.l90
      newResults.leq = griffithsResults.leq
    } else if (selectedModel === "fagotti") {
      const fagottiResults = calcFagotti(numericModelValues)
      newResults.l50 = fagottiResults
    } else if (selectedModel === "bolt") {
      const boltResults = calcBolt(numericModelValues)
      newResults.l50 = boltResults
    } else if (selectedModel === "cstb") {
      const cstbResults = calcCstb(numericModelValues)
      newResults.l50 = cstbResults.l50
      newResults.leq = cstbResults.leq
    }
    setResult(newResults)
  }, [modelValues, selectedModel])

  return (
    <section className="min-h-screen flex justify-center items-center py-12 px-2">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 bg-[#18023c]/80 border-0 shadow-2xl rounded-2xl p-4">
        <div className="flex-1 p-8 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white mb-3">Parâmetros</h2>
          <label className="text-[#cb88ff] mb-1">Modelo</label>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="w-full bg-[#34008C70] text-[#cb88ff] text-lg rounded p-2 focus:outline-none"
          >
            {models.map(m => (
              <option key={m.value} value={m.value} className="bg-[#18023c] text-[#cb88ff]">
                {m.label}
              </option>
            ))}
          </select>

          {selectedModel !== "fagotti" && (
            <>
              <label className="text-[#cb88ff] mt-3">Qtd. Veículos</label>
              <input
                type="number"
                name="param1"
                className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2"
                value={modelValues.param1}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </>
          )}

          {selectedModel === "fagotti" && (
            <>
              <label className="text-[#cb88ff] mt-3">Qtd. de Veículos leves</label>
              <input type="number" name="param1" className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2" value={modelValues.param1} onChange={handleInputChange} autoComplete="off" />
              <label className="text-[#cb88ff] mt-3">Qtd. de Veículos pesados</label>
              <input type="number" name="param2" className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2" value={modelValues.param2} onChange={handleInputChange} autoComplete="off" />
              <label className="text-[#cb88ff] mt-3">Qtd. de motocicletas</label>
              <input type="number" name="param3" className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2" value={modelValues.param3} onChange={handleInputChange} autoComplete="off" />
              <label className="text-[#cb88ff] mt-3">Qtd. de ônibus</label>
              <input type="number" name="param4" className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2" value={modelValues.param4} onChange={handleInputChange} autoComplete="off" />
            </>
          )}

          {selectedModel !== "fagotti" && selectedModel !== "cstb" && (
            <>
              <label className="text-[#cb88ff] mt-3">Distância entre o ponto de observação e o centro da pista (m)</label>
              <input
                type="number"
                name="param2"
                className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2"
                value={modelValues.param2}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </>
          )}

          {selectedModel === "cstb" && (
            <>
              <label className="text-[#cb88ff] mt-3">Largura da pista (m)</label>
              <input
                type="number"
                name="param2"
                className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2"
                value={modelValues.param2}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </>
          )}

          {(selectedModel === "galloway" || selectedModel === "burgess" || selectedModel === "griffiths") && (
            <>
              <label className="text-[#cb88ff] mt-3">Porcentagem de veículos pesados em tráfego (%)</label>
              <input
                type="number"
                name="param3"
                className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2"
                value={modelValues.param3}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </>
          )}

          {selectedModel === "johnson" ? (
            <>
              <label className="text-[#cb88ff] mt-3">Velocidade mediana dos veículos (km)</label>
              <input
                type="number"
                name="param3"
                className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2"
                value={modelValues.param3}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </>
          ) : (
            selectedModel === "galloway" && (
              <>
                <label className="text-[#cb88ff] mt-3">Velocidade mediana dos veículos (km)</label>
                <input
                  type="number"
                  name="param4"
                  className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2"
                  value={modelValues.param4}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
              </>
            )
          )}
        </div>

        <div className="flex-1 p-8 flex flex-col gap-4 border-l border-[#29166380]">
          <h2 className="text-2xl font-bold text-white mb-3">Resultados</h2>
          {selectedModel === "griffiths" && (
            <>
              <label className="text-[#cb88ff]">L10 (dB)</label>
              <input type="number" name="l10" value={result.l10} className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2" disabled />
            </>
          )}
          {["burgess", "galloway", "johnson", "hanc", "fagotti", "bolt", "cstb"].includes(selectedModel) && (
            <>
              <label className="text-[#cb88ff]">L50 (dB)</label>
              <input type="number" name="l50" value={result.l50} className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2" disabled />
            </>
          )}
          {selectedModel === "griffiths" && (
            <>
              <label className="text-[#cb88ff]">L90 (dB)</label>
              <input type="number" name="l90" value={result.l90} className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2" disabled />
            </>
          )}
          {selectedModel === "griffiths" && (
            <>
              <label className="text-[#cb88ff]">Leq (dB)</label>
              <input type="number" name="leq" value={result.leq} className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2" disabled />
            </>
          )}
          {selectedModel === "cstb" && (
            <>
              <label className="text-[#cb88ff]">Leq (dB)</label>
              <input type="number" name="leq" value={result.leq} className="bg-[#34008C70] text-[#cb88ff] text-lg w-full rounded p-2" disabled />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
