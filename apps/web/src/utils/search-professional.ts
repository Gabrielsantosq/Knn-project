import { and, cosineDistance, eq, isNotNull, sql} from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { generateEmbedding } from "./embeddings";
import { db } from "../db/client";
import { user } from "../db/schema/user";


export const searchProfessionals = createServerFn({
 method: "POST"
}).validator((data: { query: string })  => {
const query = data.query.trim();

 if (!query) {
  throw new Error("A pesquisa não pode estar vazia")
}

 return {query}
}).handler(async ({ data }) => {

  const queryEmbedding = await generateEmbedding(data.query);

  const professional = await db
    .select({
      id: user.id,
      name: user.name,
      profession: user.profession,
      abilities: user.abilities,
      distance: sql<number>`${cosineDistance(user.embedding, queryEmbedding)}`
    })
    .from(user)
    .where(
      and(
        eq(user.role, "provider"),
        isNotNull(user.embedding)
      )
    )
    .orderBy(cosineDistance(user.embedding, queryEmbedding))
    .limit(3)

  return professional
})
