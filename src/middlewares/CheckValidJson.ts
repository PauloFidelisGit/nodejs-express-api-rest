import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { useFormatResponse } from "../hooks";

interface _ErrorRequestHandler extends ErrorRequestHandler {
  type?: string;
}

export function CheckValidJson(
  err: _ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.type === "entity.parse.failed") {
    const { formatResponse, setMessage } = useFormatResponse();

    setMessage("O corpo da requisição é inválido.");

    return res.status(422).json(formatResponse);
  }
  return next();
}
