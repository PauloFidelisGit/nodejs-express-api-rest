import { PrismaDatabaseName } from 'prisma-database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { RequestHandler, Router } from 'express';
import { useFindUser, useFormatResponse, useValidateRequest } from '../../hooks';
import { envolvirements, zod as z } from '../../config';

const Controller: RequestHandler = async (req, res, next) => {
  const { formatResponse, setMessage, setData } = useFormatResponse();

  const { EMAIL, SENHA, TIPO_USUARIO } = req.body as {
    EMAIL: string;
    SENHA: string;
    TIPO_USUARIO: PrismaDatabaseName.TiposUsuarios;
  };

  const requestObject = {
    where: {
      EMAIL,
    },
    select: {
      ID: true,
      EMAIL: true,
      SENHA: true,
      TIPO_USUARIO: true,
      NOME: true,
    },
  };

  const loginMethods = useFindUser(TIPO_USUARIO);

  try {
    const data = await loginMethods(requestObject);

    if (data) {
      const hashpassword = data.SENHA as string;

      const match = await bcrypt.compare(SENHA, hashpassword);

      if (match) {
        const tokenSign = jwt.sign(
          {
            user: { ID: data.ID, TIPO_USUARIO: data.TIPO_USUARIO },
          },
          envolvirements.API_JWKEY_PASSWORD,
          {
            expiresIn: '360h',
          },
        );

        const loginDataObject = {
          ID: data.ID,
          NOME: data.NOME,
          TIPO_USUARIO: data.TIPO_USUARIO,
          TOKEN: tokenSign,
        };

        if (TIPO_USUARIO !== 'administrador') {
          Object.assign(loginDataObject, {
            //@ts-ignore
            PERMISSOES: data.PERMISSOES,
          });
        }

        setData(loginDataObject);

        setMessage('Login realizado com sucesso com sucesso.');

        return res.status(200).json(formatResponse);
      }
    }

    setMessage('E-mail ou senha incorretos.');

    return res.status(401).json(formatResponse);
  } catch (error) {
    next(error);
  }
};

const schema = z
  .object({
    EMAIL: z.string().email().max(191),
    SENHA: z.string().min(6).max(191),
    TIPO_USUARIO: z.enum(['administrador', 'usuario']),
  })
  .strict();

const ValidateRequest = useValidateRequest(schema);

const login = Router();
login.use(ValidateRequest, Controller);
export { login };
