import { Router } from "express";
import { TeamsMembersController } from "@/controllers/TeamsMembersController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const teamsMembersRoutes = Router();
const teamsMembersController = new TeamsMembersController();

teamsMembersRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]));
teamsMembersRoutes.post("/:team_id/members", teamsMembersController.add);
teamsMembersRoutes.delete(
  "/:team_id/members/:user_id",
  verifyUserAuthorization(["admin"]),
  teamsMembersController.remove
);

export { teamsMembersRoutes };
