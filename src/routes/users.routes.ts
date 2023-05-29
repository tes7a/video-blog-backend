import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { WithQueryModel } from "../models/universal/WithQueryModel";
import { UsersOutputModel } from "../models/users/UsersOutputModel";
import { usersQueryRepository } from "../repositories/query-repositories/users-query-repository";
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../types";
import { UsersQueryModel } from "../models/users/UsersQueryModel";
import { UsersCreateModel } from "../models/users/UsersCreateModel";
import { UsersCreateOutputModel } from "../models/users/UsersCreatedOutputModel";
import { userService } from "../services/users-service";
import { createUserValidationMiddleware } from "../middleware/validation/users-validation";
import { inputValidationMiddleware } from "../middleware/validation/input-validation.middleware";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";
import { URIParamsModel } from "../models/universal/URIParamsModel";

export const usersRoute = Router({});
const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

usersRoute.get(
  "/",
  async (
    req: RequestWithQuery<UsersQueryModel>,
    res: Response<WithQueryModel<UsersOutputModel[]>>
  ) => {
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
);

usersRoute.post(
  "/",
  authMiddlewareCustomVariant,
  createUserValidationMiddleware,
  async (
    req: RequestWithBody<UsersCreateModel>,
    res: Response<UsersCreateOutputModel>
  ) => {
    const { email, login, password } = req.body;
    return res
      .status(Created)
      .send(await userService.createUser({ email, login, password }));
  }
);

usersRoute.delete(
  "/",
  authMiddlewareCustomVariant,
  inputValidationMiddleware,
  async (req: RequestWithParams<URIParamsModel>, res: Response) => {
    const response = await userService.deleteUser(req.params.id);
    if (!response) return res.sendStatus(Not_Found);
    return res.sendStatus(No_Content);
  }
);
