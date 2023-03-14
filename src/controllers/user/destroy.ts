import { RequestHandler, Router } from "express";
import {
  useDatabase,
  useFormatResponse,
  useValidateRequest,
} from "../../hooks";
import { zod } from "../../config";

const Controller: RequestHandler = async (req, res, next) => {
  const { formatResponse, setMessage } = useFormatResponse();

  const {
    databaseName: { usuarios },
  } = useDatabase();

  const { ID } = req.body;

  try {
    await usuarios.delete({
      where: {
        ID,
      },
    });

    setMessage("Registro excluído com sucesso.");

    return res.status(200).json(formatResponse);
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

const destroy = Router();
destroy.use(ValidateRequest, Controller);
export { destroy };
