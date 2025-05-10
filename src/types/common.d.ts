import { response } from "@/common/resCode";
import { constant } from "@/common/constant";
import { type StatusCodes } from "http-status-codes";

interface Bcrypt {
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hashPassword: string): Promise<boolean>;
}

interface JWT {
  generateToken(payload: any): string;
  verifyToken(token: string): any;
  decodeToken(token: string): any;
}

type ResCodeMap = typeof response & {
  get(input: number | ResCodeKey, messageOverride?: any): ResponseEntry;
};

type Constant = typeof constant;

type ResCodeKey = keyof ResCodeMap;

type ResponseEntry = {
  code: number;
  message: string;
};

type Exception = (code: StatusCodes, message?: string) => void;

export { Bcrypt, JWT, ResponseEntry, ResCodeMap, Constant, Exception };
