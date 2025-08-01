import { UsersController } from "@/controllers/usersController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]));
usersRoutes.post("/", usersController.create);

export { usersRoutes };
