import { Router } from "express";
import { TaskController } from "@/controllers/TasksController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.use(ensureAuthenticated);
taskRoutes.post(
  "/:team_id/:user_id",
  verifyUserAuthorization(["admin"]),
  taskController.create
);
taskRoutes.get("/", verifyUserAuthorization(["admin"]), taskController.index);
taskRoutes.get(
  "/:task_id",
  verifyUserAuthorization(["admin", "member"]),
  taskController.show
);
taskRoutes.patch(
  "/:task_id",
  verifyUserAuthorization(["admin", "member"]),
  taskController.update
);

export { taskRoutes };
