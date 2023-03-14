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
    const data = await administradores.delete({
      where: {
        ID,
      },
    });

    setData(data);

    setMessage("Registro excluído com sucesso.");

    return res.status(200).json(formatResponse);
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

const destroy = Router();
destroy.use(ValidateRequest, Controller);
export { destroy };
