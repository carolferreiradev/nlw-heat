import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";

class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const service = new AuthenticateUserService();
    try {
      const { code } = request.body;
      const result = await service.execute(code);

      return response.json(result);
    } catch (error) {
      return response.json(error.message);
    }
  }
}

export { AuthenticateUserController };
