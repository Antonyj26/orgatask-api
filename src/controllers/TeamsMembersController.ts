import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class TeamsMembersController {
  async add(request: Request, response: Response) {
    const paramsSchema = z.object({
      team_id: z.string().uuid(),
    });

    const { team_id } = paramsSchema.parse(request.params);

    const team = await prisma.teams.findUnique({ where: { id: team_id } });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const bodySchema = z.object({
      user_id: z.string().uuid(),
    });

    const { user_id } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { id: user_id } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const userAlreadyInTeam = await prisma.teamsMembers.findFirst({
      where: {
        userId: user_id,
        teamId: team_id,
      },
    });

    if (userAlreadyInTeam) {
      throw new AppError("User already belongs to this team");
    }

    const member = await prisma.teamsMembers.create({
      data: {
        userId: user_id,
        teamId: team_id,
      },
    });

    return response.json(member);
  }
}

export { TeamsMembersController };
