import { z } from "zod";
import { JWT } from "./common";
import Redis from "ioredis";
import { Client } from "minio";

interface Mail {
  push: (
    to: string,
    subject: string,
    text: string,
    html: string
  ) => Promise<void>;
}

type Env = z.infer<typeof import("@/configs/env.config").envSchema>;

type JWTConfig = JWT & {
  generateToken: (user: object, isRefreshToken?: boolean) => string;
  verifyToken: (token: string, isRefreshToken?: boolean) => object;
  decodeToken: (token: string) => object;
};

type RedisConfig = Redis & {
  setValue: (key: string, value: string) => Promise<void>;
  getValue: (key: string) => Promise<string | null>;
  clear: () => Promise<void>;
};

type MinioConfig = Client & {
  uploadFile: (file: File) => Promise<string>;
  destroyFile: (fileName: string) => Promise<void>;
};

export { Mail, Env, JWTConfig, RedisConfig, MinioConfig };
