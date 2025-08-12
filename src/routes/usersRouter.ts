import { UsersController } from "@/controllers/UsersController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
usersRoutes.use(ensureAuthenticated);
usersRoutes.get("/", verifyUserAuthorization(["admin"]), usersController.index);
usersRoutes.get(
  "/:user_id",
  verifyUserAuthorization(["admin"]),
  usersController.show
);
usersRoutes.patch(
  "/:user_id",
  verifyUserAuthorization(["admin"]),
  usersController.update
);
usersRoutes.delete(
  "/:user_id",
  verifyUserAuthorization(["admin"]),
  usersController.remove
);

export { usersRoutes };
