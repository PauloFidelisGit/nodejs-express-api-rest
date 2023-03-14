import { RequestHandler, Router } from "express";
import {
  useDatabase,
  useFormatResponse,
  useValidateRequest,
} from "../../hooks";
import { zod as z } from "../../config";

const Controller: RequestHandler = async (req, res, next) => {
  const { formatResponse, setMessage, setData } = useFormatResponse();

  const {
    databaseName: { usuarios },
  } = useDatabase();

  const { NOME, EMAIL, CPF } = req.body;

  const searchObject = {};

  function AssignObject(keyName: string, value: string) {
    return Object.assign(searchObject, {
      [keyName]: {
        contains: value,
      },
    });
  }

  if (NOME) AssignObject("NOME", NOME);

  if (EMAIL) AssignObject("EMAIL", EMAIL);

  if (CPF) AssignObject("CPF", CPF);

  try {
    const data = await usuarios.findMany({
      where: searchObject,
      take: 20,
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
    NOME: z.string().max(191).optional(),
    EMAIL: z.string().email().max(191).optional(),
    CPF: z.string().length(11).optional(),
  })
  .strict()
  .refine(
    ({ NOME, EMAIL, CPF }) =>
      [NOME, EMAIL, CPF].every((value) => value === undefined) ? false : true,
    {
      message: "Você deve digitar ao menos uma opção de pesquisa.",
      path: ["NOME", "EMAIL", "CPF"],
    }
  );

const ValidateRequest = useValidateRequest(schema);

const search = Router();
search.use(ValidateRequest, Controller);
export { search };
