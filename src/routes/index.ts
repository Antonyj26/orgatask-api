import { Router } from "express";
import { usersRoutes } from "./usersRouter";

export const route = Router();

route.use("/users", usersRoutes);
