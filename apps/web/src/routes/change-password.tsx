import { Input } from "@workspace/ui/components/input"
import { Button } from '@workspace/ui/components/button'
import { useState } from 'react'
import { createFileRoute,useNavigate } from '@tanstack/react-router'
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

import { authClient } from '../lib/auth-client'
import { setPassword } from "better-auth/api"

const changePasswordSchema = z.object({
  password: z.string()
})


export const Route = createFileRoute('/change-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string"
      ? search.token
      : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch()
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    setMessage("")


    if (!token) {
      setMessage("Token de recuperação não encontrado")
      return
    }


    const validate = changePasswordSchema.safeParse({ newPassword })

    if (!validate.success) {
      setMessage(validate.error.issues[0].message)
      return
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      })

      if (error) {
        setMessage(error.message ?? "Erro inesperado ao tentar redefinir a senha")
      }

      await navigate({ to: "/" })

    } catch (err) {
      setMessage("Ocoreu um Error inesperado")
    } finally {
      alert("Senha alterada")
      setLoading(false)
      await navigate({to: "/signin"})
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Mude a sua Senha</CardTitle>
            <CardDescription>Insira sua nova senha.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="newpassword">Nova Senha</FieldLabel>
                  <Input
                    id="newpassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="*********"
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
