import { Request, RequestHandler, Router } from "express";
import {
  useDatabase,
  useFormatResponse,
  useRestrictAccessToOwnUser,
  useValidateRequest,
} from "../../hooks";
import { zod as z } from "../../config";
import { INFORMACOES_USUARIO_schema } from "./create";

const Controller: RequestHandler = async (req, res, next) => {
  const { formatResponse, setMessage, setData } = useFormatResponse();

  const {
    databaseName: { usuarios },
  } = useDatabase();

  const { ID } = req.body;

  delete req.body.ID;

  const requestObject = {
    where: {
      ID: ID,
    },
    data: {
      ...req.body,
    },
    select: {
      ID: true,
    },
  };

  if (req.body.INFORMACOES_USUARIO) {
    Object.assign(requestObject.data, {
      INFORMACOES_USUARIO: {
        update: {
          ...req.body.INFORMACOES_USUARIO,
          ATUALIZADO_EM: req.body.ATUALIZADO_EM,
        },
      },
    });

    delete req.body.INFORMACOES_USUARIO;
  }

  try {
    const data = await usuarios.update(requestObject);

    //@ts-ignore
    delete data?.SENHA;

    setData(data);

    setMessage("Registro atualizado com sucesso.");

    res.status(200).json(formatResponse);
  } catch (error) {
    next(error);
  }
};

const schema = z
  .object({
    ID: z.coerce.number(),
    REGISTRO_ATIVO: z.boolean().optional(),
    NOME: z.string().max(191).optional(),
    EMAIL: z.string().email().max(191).optional(),
    INFORMACOES_USUARIO: INFORMACOES_USUARIO_schema,
    ATUALIZADO_EM: z.string().length(24).datetime().max(24),
  })
  .strict();

const ValidateRequest = useValidateRequest(schema);

const RestrictAccess = useRestrictAccessToOwnUser((req: Request) => {
  return req.body.ID === req.userLogged.ID ? true : false;
});

const update = Router();
update.use(ValidateRequest, RestrictAccess, Controller);
export { update };
