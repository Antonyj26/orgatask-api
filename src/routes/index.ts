import { Router } from "express";
import { usersRoutes } from "./usersRouter";
import { sessionsRoutes } from "./sessionRouter";
import { teamsRoutes } from "./teamsRouter";
import { teamsMembersRoutes } from "./teamsMembersRouter";
import { taskRoutes } from "./taskRouter";

export const route = Router();

route.use("/users", usersRoutes);
route.use("/sessions", sessionsRoutes);
route.use("/teams", teamsRoutes);
route.use("/teams-members", teamsMembersRoutes);
route.use("/tasks", taskRoutes);
