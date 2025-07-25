import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Login() {
  return (
    <div className="max-w-sm min-h-screen mx-auto mt-30">
        <Card>
            <CardContent className="m-5">
            <h1 className="text-xl font-bold mb-5">Entrar</h1>
            <Input className="mb-5" placeholder="Email" type="email" />
            <Input className="mb-5" placeholder="Senha" type="password" />
            <Button className="w-full mb-5">Login</Button>
            <p className="text-sm text-muted-foreground">
                Não tem conta? <a href="/Cadastro" className="underline">Cadastre-se</a>
            </p>
            </CardContent>
        </Card>
    </div>
  )
}
