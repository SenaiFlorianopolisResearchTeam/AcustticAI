import { useState } from 'react'
import { Button } from '@/components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">AcusticAI</h1>
        <p className="text-gray-600">
          Frontend configurado com Tailwind CSS v4 e shadcn/ui
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <Button onClick={() => setCount((count) => count + 1)}>
              Contador: {count}
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Button variant="outline" size="sm">
              Outline
            </Button>
            <Button variant="secondary" size="sm">
              Secondary
            </Button>
            <Button variant="destructive" size="sm">
              Destructive
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>✅ Tailwind CSS v4.1.11</p>
          <p>✅ shadcn/ui básico</p>
          <p>✅ Configuração mínima</p>
        </div>
      </div>
    </div>
  )
}

export default App
