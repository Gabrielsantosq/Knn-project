import { env } from './apps/web/src/env';
import { defineConfig } from 'drizzle-kit';

console.log("DATABASE_URL existe:", Boolean(env.DATABASE_URL))

export default defineConfig({
  out: './apps/web/drizzle',
  schema: "./apps/web/src/db/schema/**",
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});
