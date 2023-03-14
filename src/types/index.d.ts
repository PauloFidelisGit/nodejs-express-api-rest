import { PrismaDatabaseName } from "prisma-database";

export type DefaultControllerMethods = "create" | "update" | "destroy" | "findUnique" | "findMany" | "updatePassword" | "search";

export interface UserToken {
  ID: number;
  TIPO_USUARIO: PrismaDatabaseName.TiposUsuarios;
}

export interface TokenPayload {
  user: UserToken;
}

export interface Token {
  userLogged: UserToken;
}

export type UserLoggedType = {
  ID: number;
  TIPO_USUARIO: PrismaDatabaseName.TiposUsuarios;
  PERMISSOES?: {
    [key in PermissionsKeysName]: {
      [key in DefaultControllerMethods]: boolean;
    };
  };
};

declare global {
  namespace Express {
    interface Request {
      token: TokenPayload;
      //configPermission: ConfigPermission;
      userLogged: UserLoggedType;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_MINUTES_FOR_RATE_LIMITE: number;
      API_PORT: string;
      API_JWKEY_PASSWORD: string;
      API_DEBUG: string;
      API_ENVOLVERIMENT: string;
      API_BASE_URL: string;
      API_BASE_PATCH: string;
    }
  }
}

export {};
