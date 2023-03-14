import { RequestHandler, Router } from "express";
import { zod as z } from "../../config";
import {
  useDatabase,
  useFormatResponse,
  useValidateRequest,
} from "../../hooks";

const Controller: RequestHandler = async (req, res, next) => {
  const { formatResponse, setMessage, setData } = useFormatResponse();

  const {
    databaseName: { usuarios },
  } = useDatabase();

  const { PAGINACAO } = req.body;

  try {
    const data = await usuarios.findMany({
      skip: PAGINACAO?.PULAR,
      take: PAGINACAO?.PEGAR,
    });

    setData(data);

    setMessage(
      data.length < 0
        ? "Registros não encontrados."
        : "Registros encontrados com sucesso."
    );

    data?.map((x) => {
      // @ts-ignore
      delete x?.SENHA;
      return x;
    });

    return res.status(200).json(formatResponse);
  } catch (error) {
    next(error);
  }
};

const schema = z
  .object({
    PAGINACAO: z
      .object({
        PEGAR: z.number().optional(),
        PULAR: z.number().optional(),
      })
      .optional(),
  })
  .strict();

const ValidateRequest = useValidateRequest(schema);

const findMany = Router();
findMany.use(ValidateRequest, Controller);
export { findMany };
