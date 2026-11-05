
import { Input } from "@workspace/ui/components/input"
import { Button } from '@workspace/ui/components/button'
import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'

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
import z from "zod"

export const Route = createFileRoute('/signup')({
component: RouteComponent,
})

const signupSchema = z.object({
  name: z.string().min(2, "O nome deve conter no minimo 2 caracteres"),
  email: z.string().email("Insira um endereço de E-mail valido."),
  password: z.string().min(8, "A Senha deve conter no minimo 8 caracteres."),
})

const providerSchema = z.object({
  profession: z.string().min(2),
  abilities: z.string().min(5),
  addressCity: z.string().min(2),
  addressState: z.string().min(2, "Digite apenas duas letras")
})

function RouteComponent() {
const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [message, setMessage] = useState("")
const [loading, setLoading] = useState(false)
const [isProvider, setIsProvider] = useState(false)
const [profession, setProfession] = useState("")
const [abilities, setAbilities] = useState("")
const [addressCity, setAddressCity] = useState("")
const [addressState, setAddressState] = useState("")

async function handlesubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setLoading(true)
  setMessage("")

  try {
    const validate = signupSchema.safeParse({ name, email, password })

    if (!validate.success) {
      setMessage(validate.error.issues[0].message)
      return
    }

    if (isProvider) {
      const validateProvider = providerSchema.safeParse({
          profession,
          abilities,
          addressCity,
          addressState
        })

      if (!validateProvider.success) {
        setMessage(validateProvider.error.issues[0].message)
        return
    }
    }

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      ...(isProvider && {
        profession,
        abilities,
        addressCity,
        addressState
      })
    })

    if (error) {
      setMessage(error.message ?? "ocorreu um erro ao criar a conta")
      return
    }

    setMessage("Conta criado com sucesso")
  } catch (err) {
    setMessage("erro inesperado ao criar a conta, tente novamente")

  } finally {
    setLoading(false)
  }
}

return (
  <div className='flex flex-col items-center justify-center min-h-screen w-full'>
    <div className='w-full max-w-sm'>
      <Card>
        <CardHeader>
          <CardTitle>Crie sua Conta</CardTitle>
          <CardDescription>Insira suas informações para criar sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlesubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='name'>Name</FieldLabel>
                <Input
                  id="name"
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="joaozinho"
                  required
                />
              </Field>
              <FieldSeparator/>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id="email"
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@gmail.com"
                  required
                />
              </Field>
                <FieldSeparator />
                <Field className="flex items-center gap-2">
                  <Input
                    type="checkbox"
                    checked={isProvider}
                    onChange={(e) => setIsProvider(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <FieldLabel htmlFor="isProvider">quero me cadastrar como um prestador de serviços</FieldLabel>
                </Field>
                {isProvider && (
                  <>
                    <Field>
                      <FieldLabel htmlFor="profession">Profession</FieldLabel>
                      <Input
                        id="profession"
                        type="text"
                        value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="Ex: Pedreiro, design, eletricista..."

                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="abilities">Habilidades</FieldLabel>
                      <Input
                        id="abilities"
                        type="text"
                        value={abilities}
                      onChange={(e) => setAbilities(e.target.value)}
                      placeholder="Ex: instalação eletrica, criação de sites..."
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="addressCity">Cidade</FieldLabel>
                      <Input
                        id="addressCity"
                        type="text"
                        value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      placeholder="Cidade"
                        required
                      />
                  </Field>
                    <Field>
                      <FieldLabel htmlFor="addressState">Estado</FieldLabel>
                      <Input
                        id="addressState"
                        type="text"
                        value={addressState}
                      onChange={(e) => setAddressState(e.target.value)}
                      placeholder="SP"
                        required
                      />
                    </Field>
                  </>
                )}
              <FieldSeparator />
              <Field>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <Input
                    id="password"
                    type='password'
                    value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                    required
                  />
                  <FieldDescription>
                    Ja tem uma conta? <Link to={"/signin"}>Sign-in</Link>
                </FieldDescription>
              </Field>
              {message && <p className="text-sm text-destructive" role="alert">{message}</p>}

              <Button className='' disabled={loading}>
                {loading ? "Cadastrando..." : "Cria conta"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
)
}
