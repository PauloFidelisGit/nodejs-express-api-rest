import { RequestHandler, Router } from "express";
import { useDatabase, useFormatResponse } from "../../hooks";

const Controller: RequestHandler = async (req, res, next) => {
  const {
    databaseName: { administradores },
  } = useDatabase();

  const { formatResponse, setMessage, setData } = useFormatResponse();

  try {
    const data = await administradores.findMany();

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

const findMany = Router();
findMany.use(Controller);
export { findMany };
