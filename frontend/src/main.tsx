import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Navbar } from './components/ui/navbar.tsx'
import { Copyright_tag } from './components/ui/copyright-tag.tsx'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'


const Main = () =>{
  return(
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <Navbar/>
        <AppRoutes/>
        <Copyright_tag/>
      </BrowserRouter>
    </StrictMode>,
    )
  )
}

export default Main()
