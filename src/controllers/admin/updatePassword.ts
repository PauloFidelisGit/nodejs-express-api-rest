import bcrypt from "bcrypt";
import { RequestHandler, Router } from "express";
import {
  useDatabase,
  useFormatResponse,
  useValidateRequest,
} from "../../hooks";

import { zod } from "../../config";

const Controller: RequestHandler = async (req, res, next) => {
  const {
    databaseName: { administradores },
  } = useDatabase();

  const { formatResponse, setMessage } = useFormatResponse();

  const { ID, SENHA_ATUAL, NOVA_SENHA, ATUALIZADO_EM } = req.body;

  delete req.body.ID;

  try {
    const userData = await administradores.findUnique({
      where: {
        ID,
      },
      select: {
        SENHA: true,
      },
    });

    const oldPasswordHash = userData!?.SENHA;

    const match = await bcrypt.compare(SENHA_ATUAL, oldPasswordHash);

    if (match) {
      const newPasswordHash = await bcrypt.hash(NOVA_SENHA, 10);

      await administradores.update({
        where: {
          ID,
        },
        data: {
          SENHA: newPasswordHash,
          ATUALIZADO_EM,
        },
      });
    }

    setMessage(
      match
        ? "Senha alterada com sucesso."
        : "Não foi possível alterar a senha."
    );

    return res.status(match ? 200 : 400).json(formatResponse);
  } catch (error) {
    next(error);
  }
};

const schema = zod
  .object({
    ID: zod.coerce.number(),
    SENHA_ATUAL: zod.string().min(6).max(191),
    NOVA_SENHA: zod.string().min(6).max(191),
    REPITA_NOVA_SENHA: zod.string().min(6).max(191),
    ATUALIZADO_EM: zod.string().length(24).datetime(),
  })
  .strict()
  .refine(
    ({ NOVA_SENHA, REPITA_NOVA_SENHA }) =>
      NOVA_SENHA !== REPITA_NOVA_SENHA ? false : true,
    {
      message:
        "Os campos 'Nova senha' e 'Repita a nova senha' devem ser iguais.",
      path: ["NOVA_SENHA", "REPITA_NOVA_SENHA"],
    }
  );

const ValidateRequest = useValidateRequest(schema);

const updatePassword = Router();
updatePassword.use(ValidateRequest, Controller);
export { updatePassword };
