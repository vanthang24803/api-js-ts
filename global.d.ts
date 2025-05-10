import { Db } from "mongodb";
import { Logger } from "pino";
import { ResCodeMap, Bcrypt, Constant, Exception } from "@/types/common";
import { Multer } from "multer";
import { Mail, Env, JWTConfig, RedisConfig, MinioConfig } from "@/types/config";
export {};

/**
 * Global variables exposed to the entire application.
 *
 * @property {ResCodeMap} resCode - A map of HTTP response codes to their corresponding messages.
 * @property {Logger} log - The logger instance used by the application.
 * @property {Db} db - The MongoDB database instance used by the application.
 * @property {Env} env - The parsed environment variables used by the application.
 * @property {Bcrypt} bcrypt - The bcrypt instance used by the application.
 * @property {JWT} jwt - The JWT instance used by the application.
 * @property {Constant} constant - The constant instance used by the application.
 * @property {Exception} exception - The exception instance used by the application.
 */
declare global {
  var resCode: ResCodeMap;
  var log: Logger;
  var db: Db;
  var env: Env;
  var bcrypt: Bcrypt;
  var constant: Constant;
  var mail: Mail;
  var jwt: JWTConfig;
  var upload: Multer;
  var exception: Exception;
  var redis: RedisConfig;
  var minio: MinioConfig;
}
