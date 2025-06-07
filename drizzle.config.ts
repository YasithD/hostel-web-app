import { defineConfig } from "drizzle-kit";
import path from "path";
import fs from "fs";

const getLocalDB = () => {
  try {
    const basePath = path.resolve(".wrangler");
    const dbFile = fs
      .readdirSync(basePath, { encoding: "utf-8", recursive: true })
      .find((file) => file.endsWith(".sqlite"));
    if (!dbFile) {
      throw new Error("No local database found");
    }
    return path.resolve(basePath, dbFile);
  } catch (error) {
    console.error(error);
  }
};

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  ...(process.env.NODE_ENV === "production"
    ? {
        dbCredentials: {
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
          apiKey: process.env.CLOUDFLARE_API_KEY,
          databaseId: process.env.CLOUDFLARE_DATABASE_ID,
        },
      }
    : {
        dbCredentials: {
          url: getLocalDB(),
        },
      }),
});
