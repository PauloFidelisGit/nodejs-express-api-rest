import { DefaultControllerMethods } from "./../types/index.d";
import { NextFunction, Request, Response } from "express";
import { useFormatResponse } from "../hooks";

export function CheckPathPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tokenNotRequired = [
    "/api/v1/shared/login",
    "/api/v1/shared/findUserByToken",
  ].includes(req.path);

  if (tokenNotRequired) return next();

  const { PERMISSOES, TIPO_USUARIO } = req.userLogged;

  if (TIPO_USUARIO === "administrador") return next();

  const { formatResponse, setMessage } = useFormatResponse();

  const resquestUrl = req.url;

  let isAuthorized: boolean | undefined = false;

  const controllerMethod2 = resquestUrl
    .split("/")
    .splice(-2)
    .map((string, index) => {
      if (index === 0) return string.toUpperCase();
      return string;
    });

  const [pathPermissionName, targetPermission] = controllerMethod2 as [
    string,
    DefaultControllerMethods
  ];

  isAuthorized = PERMISSOES?.[pathPermissionName]?.[targetPermission];

  if (isAuthorized) return next();

  setMessage("Não autorizado ~ CheckPermission 2.");
  return res.status(400).json(formatResponse);
}
