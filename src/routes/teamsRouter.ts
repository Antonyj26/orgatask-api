import { Router } from "express";
import { TeamsController } from "@/controllers/TeamsController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

export const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]));
teamsRoutes.post("/", teamsController.create);
teamsRoutes.get("/", teamsController.index);
