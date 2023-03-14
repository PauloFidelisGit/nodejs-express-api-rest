import { RequestHandler, Router } from 'express';
import { useFindUser, useFormatResponse } from '../../hooks';

const Controller: RequestHandler = async (req, res, next) => {
  const { formatResponse, setMessage, setData } = useFormatResponse();

  const { ID, TIPO_USUARIO } = req.userLogged;

  const requestObject = {
    where: {
      ID,
    },
    select: {
      ID: true,
      EMAIL: true,
      SENHA: true,
      TIPO_USUARIO: true,
      NOME: true,
    },
  };

  if (TIPO_USUARIO !== 'administrador') {
    Object.assign(requestObject.select, {
      PERMISSOES: true,
    });
  }

  const findUser = useFindUser(TIPO_USUARIO);

  try {
    const data = await findUser(requestObject);

    //@ts-ignore
    delete data?.SENHA;

    setData(data);

    setMessage('Usuário encontrado com sucesso');
    return res.status(200).json(formatResponse);
  } catch (error) {
    next(error);
  }
};

const findUserByToken = Router();
findUserByToken.use(Controller);
export { findUserByToken };
