
import { sql } from "drizzle-orm"
import { db } from "../db/client"
import { user } from "../db/schema/user"
import { generateEmbedding } from "@/utils/embeddings"

export async function searchProfessionals(query: string) {
  const embedding = await generateEmbedding(query)
  const vector = `[${embedding.join(",")}]`

  return db
    .select({
      id: user.id,
      name: user.name,
      profession: user.profession,
      abilities: user.abilities,
      distance: sql<number>`${user.embedding} <=> ${vector}::vector`,
    })
    .from(user)
    .where(
      sql`${user.role} = 'provider' AND ${user.embedding} IS NOT NULL`
    )
    .orderBy(sql`${user.embedding} <=> ${vector}::vector`)
    .limit(5)
}
