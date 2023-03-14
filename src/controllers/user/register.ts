import bcrypt from "bcrypt";
import { RequestHandler, Router } from "express";
import {
  useDatabase,
  useFormatResponse,
  useValidateRequest,
} from "../../hooks";
import { zod } from "../../config";
import { PrismaDatabaseName } from "prisma-database";

const Controller: RequestHandler = async (req, res, next) => {
  const { formatResponse, setMessage, setData } = useFormatResponse();

  const {
    databaseName: { usuarios },
  } = useDatabase();

  const { ID_PLANO } = req.body;

  delete req.body.REPITA_SENHA;
  delete req.body.ID_PLANO;

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
        PLANOS: {
          connect: {
            ID: ID_PLANO,
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

const schema = zod
  .object({
    NOME: zod.string().min(1).max(191),
    EMAIL: zod.string().email().max(191).optional(),
    SENHA: zod.string().min(6).max(191),
    REPITA_SENHA: zod.string().min(6).max(191),
    CRIADO_EM: zod.string().length(24).datetime(),
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

const register = Router();
register.use(ValidateRequest, Controller);
export default register;
