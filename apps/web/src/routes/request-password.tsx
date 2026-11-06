import { Input } from "@workspace/ui/components/input"
import { Button } from '@workspace/ui/components/button'
import {  useState } from 'react'
import {  createFileRoute, } from '@tanstack/react-router'
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
  FieldGroup,
} from "@workspace/ui/components/field"

import { authClient } from '../lib/auth-client'


export const Route = createFileRoute("/request-password")({
  component: RouteComponent
})

const requestSchema = z.object({
  email: z.string().email()
})



function RouteComponent() {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage("")
    setLoading(true)

    const validate = requestSchema.safeParse({ email })

    if (!validate.success) {
      setMessage(validate.error.issues[0].message)
      return
    }

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/change-password"
      })
      if (error) {
        setMessage(error.message ?? "Erro inesperado ao tentar encontrar o email")
        return
      }
    } catch (errr) {
      setMessage("Email invalido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Requesição de Senha</CardTitle>
            <CardDescription>Insira seu email para redefinir sua senha.</CardDescription>
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
                {message && <p className="text-sm text-destructive">{message}</p>}
                <Button disabled={loading}>
                  {loading ? "Requisitando..." : "Requisitar"}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
