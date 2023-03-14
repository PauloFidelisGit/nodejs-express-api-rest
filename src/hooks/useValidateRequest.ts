import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { zod as z } from "../config";

export default function useValidateRequest(requestSchema: ZodSchema) {
  return async function validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const parseBody = await requestSchema.parseAsync(req.body);

      req.body = parseBody;

      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          messages: error.issues,
        });
      }
      return next(error);
    }
  };
}
