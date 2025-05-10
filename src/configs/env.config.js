const path = require("path");
const { z } = require("zod");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z.object({
  PORT: z.string().min(1, "PORT is required").default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  VERSIONS: z.number().default(1),
  MONGODB_URI: z.string().url("Invalid DATABASE_URL"),
  MONGODB_DATABASE: z.string().optional().default("db"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required").default("secret"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  log.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

log.info("✅  Load env file successfully!");

const env = _env.data;
global.env = env;

module.exports = {
  envSchema,
};
