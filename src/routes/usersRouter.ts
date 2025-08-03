import { UsersController } from "@/controllers/UsersController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.use(
  ensureAuthenticated,
  verifyUserAuthorization(["admin", "member"])
);
usersRoutes.post("/", usersController.create);

export { usersRoutes };
