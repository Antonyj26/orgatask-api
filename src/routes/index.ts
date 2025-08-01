import { Router } from "express";
import { usersRoutes } from "./usersRouter";
import { sessionsRoutes } from "./sessionRouter";
import { teamsRoutes } from "./teamsRouter";

export const route = Router();

route.use("/users", usersRoutes);
route.use("/sessions", sessionsRoutes);
route.use("/teams", teamsRoutes);
