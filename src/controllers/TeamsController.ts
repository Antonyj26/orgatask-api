import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";

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
}

export { TeamsController };
