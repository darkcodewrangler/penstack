import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: ["./src/db/schemas/*.sql.ts"],
  dialect: "postgresql",
  out: "./src/db/drizzle",
});
