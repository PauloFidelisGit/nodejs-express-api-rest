import { Request, RequestHandler, Router } from "express";
import {
  useDatabase,
  useFormatResponse,
  useRestrictAccessToOwnUser,
  useValidateRequest,
} from "../../hooks";
import { zod } from "../../config";

const Controller: RequestHandler = async (req, res, next) => {
  const { formatResponse, setMessage, setData } = useFormatResponse();

  const {
    databaseName: { usuarios },
  } = useDatabase();

  const { ID } = req.body;

  try {
    const data = await usuarios.findUnique({
      where: {
        ID,
      },
    });

    //@ts-ignore
    delete data?.SENHA;

    setData(data);

    setMessage(
      data === null
        ? "Registro não encontrado."
        : "Registro encontrado com sucesso."
    );

    return res.status(data === null ? 404 : 200).json(formatResponse);
  } catch (error) {
    next(error);
  }
};

const schema = zod
  .object({
    ID: zod.coerce.number(),
  })
  .strict();

const ValidateRequest = useValidateRequest(schema);

const RestrictAccess = useRestrictAccessToOwnUser((req: Request) => {
  return req.body.ID === req.userLogged.ID ? true : false;
});

const findUnique = Router();
findUnique.use(ValidateRequest, RestrictAccess, Controller);
export { findUnique };
