import { UsersController } from "@/controllers/usersController";
import { Router } from "express";

export const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
