import { Router } from "express";
import { inputValidationMiddleware } from "../middleware/input-validation.middleware";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";
import { usersController } from "../compositions";
import { createUserValidationMiddleware } from "../middleware/validation/users-validation";

export const usersRoute = Router({});

usersRoute.get("/", usersController.getAllUsers.bind(usersController));

usersRoute.post(
  "/",
  authMiddlewareCustomVariant,
  createUserValidationMiddleware,
  usersController.createUser.bind(usersController)
);

usersRoute.delete(
  "/:id",
  authMiddlewareCustomVariant,
  inputValidationMiddleware,
  usersController.deleteUser.bind(usersController)
);
