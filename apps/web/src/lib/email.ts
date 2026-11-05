import z from "zod"
import { Resend } from "resend"
import { env } from "../env"

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  html: z.string()
})

type sendEmailInput = z.infer<typeof emailSchema>

export async function sendEmail(input: sendEmailInput) {
  const {to, subject, html} = emailSchema.parse(input)

  const resend = new Resend(env.RESEND_API_KEY);

  return resend.emails.send({
    from: "Postman@resend.dev",
    to,
    subject,
    html,
  })
}
