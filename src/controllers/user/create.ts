import bcrypt from "bcrypt";
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

  delete req.body.REPITA_SENHA;

  Object.assign(req.body, {
    SENHA: await bcrypt.hash(req.body.SENHA, 10),
  });

  try {
    const data = await usuarios.create({
      data: {
        ...req.body,
        INFORMACOES_USUARIO: {
          create: {
            ...req.body.INFORMACOES_USUARIO,
            CRIADO_EM: req.body.CRIADO_EM,
          },
        },
        PERMISSOES: {
          create: {
            ...req.body.PERMISSOES,
            CRIADO_EM: req.body.CRIADO_EM,
          },
        },
      },
    });

    //@ts-ignore
    delete data?.SENHA;

    setData(data);

    setMessage("Registro criado com sucesso.");

    res.status(200).json(formatResponse);
  } catch (error) {
    next(error);
  }
};

export const INFORMACOES_USUARIO_schema = z
  .object({
    CPF: z.string().length(11).optional(),
    OBSERVACOES: z.string().max(1000).optional(),
    TELEFONE: z.string().max(191).optional(),
    LOGRADOURO: z.string().max(191).optional(),
    NUMERO: z.string().max(191).optional(),
    BAIRRO: z.string().max(191).optional(),
    CEP: z.string().max(10).optional(),
  })
  .strict()
  .optional();

const schema = z
  .object({
    NOME: z.string().min(1).max(191),
    EMAIL: z.string().email().max(191).optional(),
    SENHA: z.string().min(6).max(191),
    REPITA_SENHA: z.string().min(6).max(191),
    PERMISSOES: z
      .object({
        USUARIO: z.object({
          update: z.boolean(),
          findUnique: z.boolean(),
          updatePassword: z.boolean(),
        }),
      })
      .strict()
      .optional(),
    INFORMACOES_USUARIO: INFORMACOES_USUARIO_schema,
    CRIADO_EM: z.string().length(24).datetime(),
  })
  .strict()
  .refine(
    ({ SENHA, REPITA_SENHA }) => (SENHA !== REPITA_SENHA ? false : true),
    {
      message: "Os campos 'Nova senha' e 'Repita a senha' devem ser iguais.",
      path: ["SENHA", "REPITA_SENHA"],
    }
  );

const ValidateRequest = useValidateRequest(schema);

const create = Router();
create.use(ValidateRequest, Controller);
export { create };
