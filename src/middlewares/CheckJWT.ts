import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { useFormatResponse } from "../hooks";
import { envolvirements } from "../config";
import { TokenPayload } from "../types";

export function CheckJWT(req: Request, res: Response, next: NextFunction) {
  const tokenNotRequired = ["/api/v1/shared/login"].includes(req.path);

  if (tokenNotRequired) return next();

  const { API_JWKEY_PASSWORD } = envolvirements;

  const { formatResponse, setMessage } = useFormatResponse();

  const userToken = req.headers.authorization?.replace("Bearer ", "") as string;

  try {
    const decode = jwt.verify(userToken, API_JWKEY_PASSWORD) as TokenPayload;

    req.token = decode;

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      setMessage("Token inválido ~ checkJWT.");

      return res.status(401).json(formatResponse);
    }
  }

  return res.status(401).json(formatResponse);
}
