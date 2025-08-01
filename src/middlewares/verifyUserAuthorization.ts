import { AppError } from "@/utils/AppError";
import { NextFunction, Request, Response } from "express";

export function verifyUserAuthorization(role: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    console.log("🔐 Verificando role do usuário:", request.user);
    if (!request.user) {
      console.log("🚫 Usuário não está autenticado.");
      throw new AppError("Unauthorized", 401);
    }

    if (!role.includes(request.user.role)) {
      console.log("🚫 Role não autorizada:", request.user.role);
      throw new AppError("Unauthorized", 401);
    }

    return next();
  };
}
