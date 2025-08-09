import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";
import { report, throwDeprecation } from "process";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findFirst({ where: { email } });

    if (userWithSameEmail) {
      throw new AppError("There is already a user with that email");
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return response.status(201).json(userWithoutPassword);
  }

  async index(request: Request, response: Response) {
    const users = await prisma.user.findMany();

    return response.json(users);
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      user_id: z.string().uuid(),
    });

    const { user_id } = paramsSchema.parse(request.params);

    const user = await prisma.user.findUnique({ where: { id: user_id } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return response.json(user);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      user_id: z.string().uuid(),
    });

    const { user_id } = paramsSchema.parse(request.params);

    const user = await prisma.user.findUnique({ where: { id: user_id } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const bodySchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      role: z.enum(["admin", "member"]),
    });

    const { name, email, role } = bodySchema.parse(request.body);

    await prisma.user.update({
      where: { id: user_id },
      data: {
        name,
        email,
        role,
      },
    });

    return response.json({ message: "User has been updated " });
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      user_id: z.string().uuid(),
    });

    const { user_id } = paramsSchema.parse(request.params);

    const user = prisma.user.findUnique({ where: { id: user_id } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await prisma.user.delete({ where: { id: user_id } });

    return response.json({ message: "User has been deleted" });
  }
}

export { UsersController };
