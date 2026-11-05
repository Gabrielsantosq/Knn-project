import { createProfessional } from "../utils/create-profissional";
import { generateEmbedding } from "../utils/embeddings";
import { db } from "./client";
import { user } from "./schema/user";

const professionals = [
  {
    name: "João Silva",
    email: "joao.eletricista@example.com",
    profession: "Eletricista",
    abilities:
      "Instalação de chuveiros, tomadas, troca de disjuntores e manutenção elétrica residencial",
    addressCity: "Senhor do Bonfim",
    addressState: "BA",
  },
  {
    name: "Maria Santos",
    email: "maria.encanadora@example.com",
    profession: "Encanadora",
    abilities:
      "Reparo de vazamentos, instalação de torneiras, desentupimentos e manutenção hidráulica",
    addressCity: "Senhor do Bonfim",
    addressState: "BA",
  },
  {
    name: "Carlos Oliveira",
    email: "carlos.eletricista@example.com",
    profession: "Eletricista",
    abilities:
      "Instalação de iluminação, fiação elétrica, quadros de distribuição e troca de disjuntores",
    addressCity: "Juazeiro",
    addressState: "BA",
  },
  {
    name: "Ana Costa",
    email: "ana.passadeira@example.com",
    profession: "Passadeira",
    abilities:
      "Passar roupas sociais, camisas, calças e roupas do dia a dia",
    addressCity: "Senhor do Bonfim",
    addressState: "BA",
  },
  {
    name: "Pedro Souza",
    email: "pedro.marceneiro@example.com",
    profession: "Marceneiro",
    abilities:
      "Montagem de móveis, fabricação de armários, instalação de portas e reparos em madeira",
    addressCity: "Petrolina",
    addressState: "PE",
  },
];




for (const p of professionals) {
  const text = createProfessional(p)
  const embedding = await generateEmbedding(text)

  console.log(p.name, embedding.length)
  await db
    .insert(user)
    .values({
      id: crypto.randomUUID(),
      name: p.name,
      email: p.email,
      emailVerified: true,
      role: "provider",
      profession: p.profession,
      abilities: p.abilities,
      addressCity: p.addressCity,
      addressState: p.addressState,
      embedding,
    }).onConflictDoNothing({target: user.email})

  console.log(`${p.name}: processando`)
}
