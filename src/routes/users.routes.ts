import { Router } from "express";
import { usersController } from "../compositions";
import {
  authMiddlewareCustomVariant,
  createUserValidationMiddleware,
  inputValidationMiddleware,
} from "../middleware";

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
