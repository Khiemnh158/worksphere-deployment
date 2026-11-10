import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";

const file = new URL("../.env.local", import.meta.url);
const names = ["DEPLOY_DB_PASSWORD", "DEPLOY_JWT_SECRET", "DEPLOY_DEMO_PASSWORD"];
const values = names.map((name) => `${name}=${randomBytes(24).toString("hex")}`);
try {
  writeFileSync(file, values.join("\n") + "\n", { flag: "wx", mode: 0o600 });
  console.log("Created .env.local");
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  console.log("Kept existing .env.local");
}
