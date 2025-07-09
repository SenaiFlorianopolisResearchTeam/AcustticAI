import { Button } from '@/components/ui/button'
import { ArrowBigRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className='min-h-screen mt-10 mb-0 justify-center lg:px-12'>
      <div className='flex items-center md:space-x-70'>
        <div className='flex-1 text-center md:text-left space-y-6'>
          <h1 className='text-7xl text-white w-4 font-bold'>Iniciação Científica</h1>
          <p className='text-2xl text-[#d8cbff]'>
            Grupo de Iniciação Científica de Florianópolis, Santa Catarina, propondo ferramentas para análises em <b>acústica</b> de forma acessível
          </p>
          <Link to="/About">
          <Button size="IC">Saiba mais<ArrowBigRight /></Button>
          </Link>
        </div>
        <div className='flex-1 flex justify-center'>
            <img src="Elements/Rocket.svg" alt="Foguete" width={470}/>

        </div>
      </div>
    </div>
  )
}
