import { Router } from "express";
import { usersRoutes } from "./usersRouter";
import { sessionsRoutes } from "./sessionRouter";

export const route = Router();

route.use("/users", usersRoutes);
route.use("/sessions", sessionsRoutes);
