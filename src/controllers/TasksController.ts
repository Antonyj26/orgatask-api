import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class TaskController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string(),
      description: z.string(),
      status: z
        .enum(["pending", "in_progress", "completed"])
        .default("pending"),
      priority: z.enum(["high", "medium", "low"]).default("low"),
    });

    const { title, description, priority, status } = bodySchema.parse(
      request.body
    );

    const paramsSchema = z.object({
      team_id: z.string().uuid(),
      user_id: z.string().uuid(),
    });

    const { team_id, user_id } = paramsSchema.parse(request.params);

    const team = await prisma.teams.findUnique({ where: { id: team_id } });
    const user = await prisma.user.findUnique({ where: { id: user_id } });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const member = await prisma.teamsMembers.findFirst({
      where: {
        teamId: team_id,
        userId: user_id,
      },
    });

    if (!member) {
      throw new AppError("Member not found in this team", 404);
    }

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        priority,
        status,
        assignedToId: user_id,
        teamId: team_id,
      },
    });

    return response.status(201).json(task);
  }

  async index(request: Request, response: Response) {
    const tasks = await prisma.tasks.findMany();

    if (!tasks) {
      throw new AppError("No tasks found", 404);
    }

    return response.json(tasks);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      task_id: z.string().uuid(),
    });

    const { task_id } = paramsSchema.parse(request.params);

    const task = await prisma.tasks.findFirst({ where: { id: task_id } });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return response.json(task);
  }
}

export { TaskController };
