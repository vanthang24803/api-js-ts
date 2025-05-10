import { Db } from "mongodb";
import { Logger } from "pino";
import { z } from "zod";
import { ResCodeMap, Bcrypt, JWT } from "@/types/common";
import { type StatusCodes } from "http-status-codes";

export {};

/**
 * Global variables exposed to the entire application.
 *
 * @property {ResCodeMap} resCode - A map of HTTP response codes to their corresponding messages.
 * @property {Logger} log - The logger instance used by the application.
 * @property {Db} db - The MongoDB database instance used by the application.
 * @property {z.infer<typeof import("@/configs/env.config").envSchema>} env - The parsed environment variables used by the application.
 * @property {Bcrypt} bcrypt - The bcrypt instance used by the application.
 * @property {JWT} jwt - The JWT instance used by the application.
 */
declare global {
  var resCode: ResCodeMap;
  var log: Logger;
  var db: Db;
  var env: z.infer<typeof import("@/configs/env.config").envSchema>;
  var bcrypt: Bcrypt;
  var jwt: JWT;
  var exception: (code: StatusCodes, message?: string) => void;
}
