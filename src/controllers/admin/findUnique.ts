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

  const { ID } = req.body;

  try {
    const data = await administradores.findUnique({
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

const schema = z
  .object({
    ID: z.number(),
  })
  .strict();

const ValidateRequest = useValidateRequest(schema);

const findUnique = Router();
findUnique.use(ValidateRequest, Controller);
export { findUnique };
