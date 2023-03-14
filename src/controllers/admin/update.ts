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

  const { formatResponse, setMessage } = useFormatResponse();

  const { ID } = req.body;

  delete req.body.ID;

  try {
    await administradores.update({
      where: {
        ID: ID,
      },
      data: req.body,
    });

    setMessage("Registro atualizado com sucesso.");

    res.status(200).json(formatResponse);
  } catch (error) {
    next(error);
  }
};

const schema = z
  .object({
    ID: z.number(),
    REGISTRO_ATIVO: z.boolean().optional(),
    NOME: z.string().max(191).optional(),
    EMAIL: z.string().email().max(191).optional(),
    ATUALIZADO_EM: z.string().length(24).datetime(),
  })
  .strict();

const ValidateRequest = useValidateRequest(schema);

const update = Router();
update.use(ValidateRequest, Controller);
export { update };
