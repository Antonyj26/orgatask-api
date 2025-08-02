import { Router } from "express";
import { TeamsController } from "@/controllers/TeamsController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

export const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]));
teamsRoutes.post("/", teamsController.create);
teamsRoutes.get("/", teamsController.index);
teamsRoutes.get("/:team_id", teamsController.show);
teamsRoutes.patch("/:team_id", teamsController.update);
teamsRoutes.delete("/:team_id", teamsController.remove);
