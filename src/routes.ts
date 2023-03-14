import { Router } from "express";
import {
  // @index(['../src/controllers/*', '!../src/controllers/index.ts'], f => `${f.path.replace(/^.*\/(.*)$/, '$1')},`)
  admin,
  shared,
  user,
  // @endindex
} from "./controllers";

const routes = Router();

// admin
routes
  .post("/admin/create", admin.create)
  .put("/admin/update", admin.update)
  .put("/admin/updatePassword", admin.updatePassword)
  .post("/admin/findUnique", admin.findUnique)
  .post("/admin/findMany", admin.findMany)
  .delete("/admin/destroy", admin.destroy);

// user
routes
  .post("/user/create", user.create)
  .put("/user/update", user.update)
  .put("/user/updatePassword", user.updatePassword)
  .post("/user/findUnique", user.findUnique)
  .post("/user/findMany", user.findMany)
  .post("/user/search", user.search)
  .delete("/user/destroy", user.destroy);

// shared
routes
  .post("/shared/login", shared.login)
  .get("/shared/findUserByToken", shared.findUserByToken);

export default routes;
