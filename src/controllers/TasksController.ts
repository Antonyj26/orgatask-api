import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { title } from "process";

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

    if (tasks.length === 0) {
      throw new AppError("No tasks found", 404);
    }

    return response.json(tasks);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      task_id: z.string().uuid(),
    });

    const { task_id } = paramsSchema.parse(request.params);

    const task = await prisma.tasks.findUnique({ where: { id: task_id } });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return response.json(task);
  }

  async update(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
    });

    const { title, description, status, priority } = bodySchema.parse(
      request.body
    );

    const paramsSchema = z.object({
      task_id: z.string().uuid(),
    });

    const { task_id } = paramsSchema.parse(request.params);

    const task = await prisma.tasks.findUnique({ where: { id: task_id } });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    if (
      request.user.role !== "admin" &&
      !(request.user.role === "member" && task.assignedToId === request.user.id)
    ) {
      throw new AppError("You do not permission to update this task", 403);
    }

    const dataToUpdate: any = {};

    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (status !== undefined) dataToUpdate.status = status;
    if (priority !== undefined) dataToUpdate.priority = priority;

    await prisma.tasks.update({
      where: { id: task_id },
      data: dataToUpdate,
    });

    return response
      .status(201)
      .json({ message: "Task has been updated successfully" });
  }
}

export { TaskController };
