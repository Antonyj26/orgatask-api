import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(3),
      description: z.string().min(6),
    });

    const { name, description } = bodySchema.parse(request.body);

    const team = await prisma.teams.create({
      data: {
        name,
        description,
      },
    });

    return response.status(201).json(team);
  }

  async index(request: Request, response: Response) {
    const teams = await prisma.teams.findMany();

    return response.json(teams);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.string().uuid(),
    });

    const { team_id } = paramsSchema.parse(request.params);

    const team = await prisma.teams.findUnique({ where: { id: team_id } });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    return response.json(team);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.string().uuid(),
    });

    const { team_id } = paramsSchema.parse(request.params);

    const team = await prisma.teams.findUnique({ where: { id: team_id } });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const bodySchema = z.object({
      name: z.string().min(3),
      description: z.string().min(6),
    });

    const { name, description } = bodySchema.parse(request.body);

    await prisma.teams.update({
      where: { id: team_id },
      data: {
        name,
        description,
      },
    });

    return response.status(200).json({ message: "Team has been updated" });
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.string().uuid(),
    });

    const { team_id } = paramsSchema.parse(request.params);

    const team = await prisma.teams.findUnique({ where: { id: team_id } });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    await prisma.teams.delete({ where: { id: team_id } });

    return response.status(200).json({ message: "Team has been deleted" });
  }
}

export { TeamsController };
