
import { pgTable, text, timestamp, boolean, pgEnum, vector } from "drizzle-orm/pg-core";


export const roleEnum = pgEnum("role", [
  "client",
  "provider",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(true).notNull(),
  image: text("image"),
  role: roleEnum("role").default("client").notNull(),
  profession: text("profession"),
  abilities: text("abilities"),
  addressCity: text("address_city"),
  addressState: text("address_state"),
  embedding: vector("embedding", {dimensions: 512}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
