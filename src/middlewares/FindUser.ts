import { Request, Response, NextFunction } from "express";
import { useFindUser, useFormatResponse } from "../hooks";
import { UserLoggedType } from "../types";

export async function FindUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { formatResponse, setMessage } = useFormatResponse();

  const tokenNotRequired = ["/api/v1/shared/login"].includes(req.path);
  if (tokenNotRequired) return next();

  const { ID, TIPO_USUARIO } = req.token?.user;

  const requestObject = {
    where: {
      ID,
    },
    select: {
      TIPO_USUARIO: true,
    },
  };

  if (TIPO_USUARIO !== "administrador") {
    Object.assign(requestObject.select, {
      PERMISSOES: true,
    });
  }

  const findUser = useFindUser(TIPO_USUARIO);

  try {
    const data = (await findUser(requestObject)) as UserLoggedType;

    if (data === null) {
      setMessage("Usuário não encontrado. 1");
      return res.status(404).json(formatResponse);
    }

    req.userLogged = {
      ID,
      TIPO_USUARIO: data?.TIPO_USUARIO,
    };

    if (TIPO_USUARIO !== "administrador") {
      Object.assign(req.userLogged, {
        PERMISSOES: data?.PERMISSOES,
      });
    }

    return next();
  } catch (error) {
    setMessage("Usuário não encontrado.");
    return res.status(404).json(formatResponse);
  }
}
