import { Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { WithQueryModel } from "../models/universal/WithQueryModel";
import { UsersOutputModel } from "../models/users/UsersOutputModel";
import { usersQueryRepository } from "../repositories/query-repositories/users-query-repository";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from "../types/types";
import { UsersQueryModel } from "../models/users/UsersQueryModel";
import { UsersCreateModel } from "../models/users/UsersCreateModel";
import { UsersCreateOutputModel } from "../models/users/UsersCreatedOutputModel";
import { createUserValidationMiddleware } from "../middleware/validation/users-validation";
import { inputValidationMiddleware } from "../middleware/input-validation.middleware";
import { URIParamsModel } from "../models/universal/URIParamsModel";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";
import { userService } from "../services";

export const usersRoute = Router({});

const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

class UsersController {
  async getAllUsers(
    req: RequestWithQuery<UsersQueryModel>,
    res: Response<WithQueryModel<UsersOutputModel[]>>
  ) {
    const {
      pageNumber,
      pageSize,
      searchEmailTerm,
      searchLoginTerm,
      sortBy,
      sortDirection,
    } = req.query;

    return res.status(OK).send(
      await usersQueryRepository.getUsers({
        pageNumber,
        pageSize,
        searchEmailTerm,
        searchLoginTerm,
        sortBy,
        sortDirection,
      })
    );
  }

  async createUser(
    req: RequestWithBody<UsersCreateModel>,
    res: Response<UsersCreateOutputModel>
  ) {
    const { email, login, password } = req.body;
    return res
      .status(Created)
      .send(await userService.createUser({ email, login, password }));
  }

  async deleteUser(req: RequestWithParams<URIParamsModel>, res: Response) {
    const result = await userService.deleteUser(req.params.id);
    if (!result) return res.sendStatus(Not_Found);
    return res.sendStatus(No_Content);
  }
}

const usersControllerInstance = new UsersController();

usersRoute.get("/", usersControllerInstance.getAllUsers);

usersRoute.post(
  "/",
  authMiddlewareCustomVariant,
  createUserValidationMiddleware,
  usersControllerInstance.createUser
);

usersRoute.delete(
  "/:id",
  authMiddlewareCustomVariant,
  inputValidationMiddleware,
  usersControllerInstance.deleteUser
);
