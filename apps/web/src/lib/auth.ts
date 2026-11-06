import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { db } from "../db/client";
import { schema } from "../db/schema";
import { sendEmail } from "./email";
import { user } from "../db/schema/user";
import { eq } from "drizzle-orm";
import { generateEmbedding } from "../utils/embeddings";
import { createProfessionalText } from "../utils/create-professional";

type profissionalFields = {
  profession?: string,
  abilities?: string,
  addressCity?: string,
  addressState?: string
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  user: {
    additionalFields: {
      role: {
        type: ["client", "provider"],
        defaultValue: "client",
        input: false,
        required: false
      },
      profession: {
        type: "string",
        input: true,
        required: false
      },
      abilities: {
        type: "string",
        input: true,
        required: false
      },
      addressCity: {
        type: "string",
        input: true,
        required: false
      },
      addressState: {
        type: "string",
        input: true,
        required: false,
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      void sendEmail({
        to: user.email,
        subject: "Verifique seu endereço de email",
        html: `<p>Clique no link para verificar seu E-mail: ${url}</p>`
      })
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      void sendEmail({
        to: user.email,
        subject: "Verifique seu endereço E-mail",
        html: `<p>Clique no link para verificar seu E-mail: ${url}</p>`
      })
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const professional = user as typeof user & profissionalFields

          const isProvider =
            Boolean(professional.profession?.trim()) &&
            Boolean(professional.abilities?.trim()) &&
            Boolean(professional.addressCity?.trim()) &&
            Boolean(professional.addressState?.trim())

          return {
            data: {
              ...user,
              role: isProvider ? "provider" : "client"
            }
          }
        },
        after: async (userData) => {
          const professional = userData as typeof userData & profissionalFields;

          if(professional.role !== "provider" || !professional.profession || !professional.abilities) {
            return
          }
          const text = createProfessionalText({ profession: professional.profession, abilities: professional.abilities })
          const embedding: number[] = await generateEmbedding(text)

          await db
            .update(user)
            .set({ embedding })
            .where(eq(user.id, userData.id));
        }
      },
    },
  }
});
