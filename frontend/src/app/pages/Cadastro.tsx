import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Cadastro() {
  return (
    <div className="max-w-sm min-h-screen mx-auto mt-30">
        <Card className="">
            <CardContent className="m-5">
            <h1 className="text-xl font-bold mb-5">Cadastrar-se</h1>
            <Input className="mb-5" placeholder="Email" type="email" />
            <Input className="mb-5" placeholder="Confirmar Email" type="email" />
            <Input className="mb-5" placeholder="Senha" type="password" />
            <Button className="w-full mb-5">Cadastrar</Button>
            <p className="text-sm text-muted-foreground">
                Já possue uma conta? <a href="/Login" className="underline">Faça Login</a>
            </p>
            </CardContent>
        </Card>
    </div>
  )
}
