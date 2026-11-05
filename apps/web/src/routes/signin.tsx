
import { Input } from "@workspace/ui/components/input"
import { Button } from '@workspace/ui/components/button'
import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import z from "zod"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card"

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldSeparator
} from "@workspace/ui/components/field"

import {Alert, AlertTitle, AlertDescription} from "@workspace/ui/components/alert"

import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/signin')({
  component: RouteComponent,
})


const signInSchema = z.object({
  email: z.string().min(1, "preencha corretamente o campo"),
  password: z.string().min(8, "A senha deve conter no minimo 8 caracteres")
})

type Feedback = {
  type: "success" | "error"
  message: string
}

function RouteComponent() {

  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)


    try {



          const validate = signInSchema.safeParse({ email, password })

          if (!validate.success) {
            setFeedback({
              type: "error",
              message: validate.error.issues[0].message
            })
            return
          }
      const { error } = await authClient.signIn.email({
        email,
        password,
      })

      if (error) {
        setFeedback({type: "error", message: error.message  || "Não foi possivel achar, verifique suas credenciais."})
        return
      }

      setFeedback({type: "success", message: "Login realizado com sucesso"})

      await navigate({to: "/"})
    } catch (err) {
      setFeedback({type:"error", message: "Ocorreu um erro inesperado."})

    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Preencha seus dados para entrar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@example.com"
                    required
                  />
                </Field>
                <FieldSeparator />
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                  />
                  <FieldDescription>
                    Não tem uma conta? <Link to="/signup">Sign-Up</Link>
                  </FieldDescription>
                  <FieldDescription>
                    Esqueceu a senha? <Link to="/request-password">esqueci a senha</Link>
                  </FieldDescription>
                </Field>
                {feedback && (
                  <Alert
                    variant={
                      feedback.type === "error" ? "destructive" : "default"
                    }
                    role={feedback.type === "error" ? "alert" : "status"}
                  >
                    <AlertTitle>
                      {feedback.type === "success" ? "sucesso" : "Erro no login"}
                    </AlertTitle>
                    <AlertDescription>
                      {feedback.message}
                    </AlertDescription>
                  </Alert>
                )}
                <Button disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>

        </Card>
      </div>
    </div>
  )
}
