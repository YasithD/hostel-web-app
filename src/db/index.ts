import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export const db = drizzle((await getCloudflareContext({ async: true })).env.DB, {
  schema,
});
