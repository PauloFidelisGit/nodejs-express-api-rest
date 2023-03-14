//@ts-nocheck
import { NextFunction, Request, Response } from "express";
import { useDebug } from "../hooks";

export function InterceptorLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  useDebug({
    label: `UserId: ${req?.token?.user?.ID} - token`,
    data: req?.token,
  });

  useDebug({
    label: `UserId: ${req?.token?.user?.ID} - Request: ${req.url}`,
    data: req.body,
  });

  const oldSend = res.send;

  res.send = function (data) {
    useDebug({
      label: `UserId: ${req?.token?.user?.ID} - Logged user`,
      data: req.userLogged,
    });
    useDebug({
      label: `UserId: ${req?.token?.user?.ID} - Response: /api/v1${req.url}`,
      data: JSON.parse(data),
    });
    useDebug({
      label: `UserId: ${req?.token?.user?.ID} - Response status`,
      data: res.statusCode,
    });

    oldSend.apply(res, arguments);
  };

  return next();
}
