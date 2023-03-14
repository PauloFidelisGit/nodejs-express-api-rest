import { PrismaDatabaseName } from "prisma-database";

const { PrismaClient: PrismaDatabaseNameClient } = PrismaDatabaseName;

const geraCalc = new PrismaDatabaseNameClient({
  errorFormat: "pretty",
});

export default function useDatabase() {
  return {
    databaseName: {
      administradores: geraCalc.administradores,
      usuarios: geraCalc.usuarios,
    },
  };
}
