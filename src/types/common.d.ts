import { response } from "@/common/resCode";
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

type ResCodeKey = keyof ResCodeMap;

type ResponseEntry = {
  code: number;
  message: string;
};

export { Bcrypt, JWT, ResponseEntry, ResCodeMap };
