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
  REDIS_HOST: z.string().optional().default("localhost"),
  REDIS_PORT: z.string().optional().default("6379"),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().optional().default("0"),
  MINIO_ENDPOINT: z.string().optional().default("localhost"),
  MINIO_PORT: z.string().optional().default("9000"),
  MINIO_USE_SSL: z.boolean().optional().default(false),
  MINIO_ACCESS_KEY: z.string().optional().default("root"),
  MINIO_SECRET_KEY: z.string().optional().default("minioPassword"),
  MINIO_BUCKET_NAME: z.string().optional().default("default"),
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
