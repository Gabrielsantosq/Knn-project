import { env } from "../env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

console.log("DATABASE_URL existe:", Boolean(env.DATABASE_URL))


const pool = new Pool({
  connectionString: env.DATABASE_URL!,
});

export const db = drizzle({ client: pool});
