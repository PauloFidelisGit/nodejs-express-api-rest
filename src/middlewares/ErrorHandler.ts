import { Response, Request, ErrorRequestHandler, NextFunction } from "express";
import { PrismaDatabaseName } from "prisma-database";
import { useDebug, useFormatResponse } from "../hooks";

export function ErrorHandler(
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  useDebug({ label: `Error Handler: ${req.url}`, data: error });

  const { formatResponse, setMessage } = useFormatResponse();

  if (
    error instanceof PrismaDatabaseName.Prisma.PrismaClientKnownRequestError
  ) {
    if (error.code === "P2002") {
      const target = error.meta!.target as string;

      if (
        ["Usuarios_EMAIL_key", "Administradores_EMAIL_key"].includes(target)
      ) {
        setMessage("O campo 'E-mail' já está cadastrado.");
      }

      if (["InformacoesUsuario_CPF_key"].includes(target)) {
        setMessage("O campo 'CPF' já está cadastrado.");
      }
    }

    if (error.code === "P2025") {
      setMessage("Registro não encontrado.");
    }
  }

  if (formatResponse.messages.length > 0) {
    return res.status(400).json(formatResponse);
  }

  setMessage("Erro interno. Por favor comunique o suporte.");

  return res.status(500).json(formatResponse);
}
