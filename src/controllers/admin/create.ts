import bcrypt from "bcrypt";
import { RequestHandler, Router } from "express";
import {
  useDatabase,
  useFormatResponse,
  useValidateRequest,
} from "../../hooks";
import { zod as z } from "../../config";

const Controller: RequestHandler = async (req, res, next) => {
  const {
    databaseName: { administradores },
  } = useDatabase();

  const { formatResponse, setMessage, setData } = useFormatResponse();

  Object.assign(req.body, {
    SENHA: await bcrypt.hash(req.body.SENHA, 10),
  });

  try {
    const data = await administradores.create({
      data: req.body,
    });

    //@ts-ignore
    delete data?.SENHA;
    //@ts-ignore
    delete data?.ATUALIZADO_EM;

    setData(data);

    setMessage("Registro criado com sucesso.");

    return res.status(200).json(formatResponse);
  } catch (error) {
    next(error);
  }
};

const schema = z
  .object({
    NOME: z.string().min(1).max(191),
    EMAIL: z.string().email().min(1).max(191),
    SENHA: z.string().min(6).max(191),
    CRIADO_EM: z.string().length(24).datetime(),
  })
  .strict();

const ValidateRequest = useValidateRequest(schema);

const create = Router();
create.use(ValidateRequest, Controller);
export { create };
