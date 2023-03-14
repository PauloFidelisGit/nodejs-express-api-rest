import bcrypt from "bcrypt";
import { Request, RequestHandler, Router } from "express";
import {
  useDatabase,
  useFormatResponse,
  useRestrictAccessToOwnUser,
  useValidateRequest,
} from "../../hooks";
import { zod } from "../../config";

const Controller: RequestHandler = async (req, res, next) => {
  const { formatResponse, setMessage } = useFormatResponse();

  const {
    databaseName: { usuarios },
  } = useDatabase();

  const { ID, SENHA_ATUAL, NOVA_SENHA, ATUALIZADO_EM } = req.body;

  delete req.body.ID;

  try {
    const userData = await usuarios.findUnique({
      where: {
        ID,
      },
      select: {
        SENHA: true,
      },
    });

    if (userData?.SENHA) {
      const oldPasswordHashpassword = userData.SENHA;

      const match = await bcrypt.compare(SENHA_ATUAL, oldPasswordHashpassword);

      if (match) {
        const newPassowrdHashpassword = await bcrypt.hash(NOVA_SENHA, 10);

        await usuarios.update({
          where: {
            ID,
          },
          data: {
            SENHA: newPassowrdHashpassword,
            ATUALIZADO_EM,
          },
        });

        setMessage("Senha alterada com sucesso.");

        return res.status(200).json(formatResponse);
      }
    }

    if (userData?.SENHA === null) {
      setMessage("O usuário não possui senha definida.");

      return res.status(400).json(formatResponse);
    }

    setMessage("Não foi possível alterar a senha. 2");

    return res.status(400).json(formatResponse);
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

const RestrictAccess = useRestrictAccessToOwnUser((req: Request) => {
  return req.body.ID === req.userLogged.ID ? true : false;
});

const updatePassword = Router();
updatePassword.use(ValidateRequest, RestrictAccess, Controller);
export { updatePassword };
