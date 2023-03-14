import { PrismaDatabaseName } from "prisma-database";
import useDatabase from "./useDatabase";

type IuseFindUser = PrismaDatabaseName.TiposUsuarios;

interface IFindUser {
  administrador: (
    requestObject: PrismaDatabaseName.Prisma.AdministradoresFindUniqueArgs
  ) => Promise<PrismaDatabaseName.Administradores | null>;
  usuario: (
    requestObject: PrismaDatabaseName.Prisma.UsuariosFindUniqueArgs
  ) => Promise<PrismaDatabaseName.Usuarios | null>;
}

export default function useFindUser(TIPO_USUARIO: IuseFindUser) {
  const {
    databaseName: { administradores, usuarios },
  } = useDatabase();

  const findUser: IFindUser = {
    administrador: async (requestObject) =>
      administradores.findUnique(requestObject),
    usuario: async (requestObject) => usuarios.findUnique(requestObject),
  };

  return findUser[TIPO_USUARIO];
}
