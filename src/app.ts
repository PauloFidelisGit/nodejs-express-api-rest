import express from "express";
import cors from "cors";
import routes from "./routes";
import helmet from "helmet";
import {
  // @index(['./middlewares/*','!./middlewares/index.ts','!./*test.ts'], f => `${f.name},`)
  CheckJWT,
  CheckPathPermission,
  CheckValidJson,
  ErrorHandler,
  FindUser,
  InterceptorLogger,
  NotFound,
  // @endindex
} from "./middlewares";
import { envolvirements, rateLimitConfig } from "./config";

const app = express();

app.use(helmet());

app.use(rateLimitConfig);

app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(express.json());

app.use(CheckValidJson);

app.use(CheckJWT);

if (envolvirements.API_DEBUG) {
  app.use(InterceptorLogger);
}

app.use(FindUser);

app.use(CheckPathPermission);

app.use(envolvirements.API_BASE_PATCH, routes);

app.use(ErrorHandler);

app.use("*", NotFound);

export default app;
