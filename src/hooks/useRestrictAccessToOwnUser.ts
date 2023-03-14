import { NextFunction, Request, Response } from "express";
import useFormatResponse from "./useFormatResponse";

export default function useRestrictAccessToOwnUser(conditionFunction: {
  (req: Request): boolean;
}) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const { TIPO_USUARIO } = req.userLogged;

    if (TIPO_USUARIO === "administrador") return next();

    const { formatResponse, setMessage } = useFormatResponse();

    const isTrut = conditionFunction(req);

    if (isTrut) {
      return next();
    }

    setMessage("Não autorizado.");

    return res.status(401).json(formatResponse);
  };
}
