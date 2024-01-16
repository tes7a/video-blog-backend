import { Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from "../types/types";
import { UserService } from "../services";
import {
  URIParamsModel,
  UsersCreateModel,
  UsersCreateOutputModel,
  UsersOutputModel,
  UsersQueryModel,
  WithQueryModel,
} from "../models";
import { UsersQueryRepository } from "../repositories";

export const usersRoute = Router({});

const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

export class UsersController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected userService: UserService
  ) {}

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
      await this.usersQueryRepository.getUsers({
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
      .send(await this.userService.createUser({ email, login, password }));
  }

  async deleteUser(req: RequestWithParams<URIParamsModel>, res: Response) {
    const result = await this.userService.deleteUser(req.params.id);
    if (!result) return res.sendStatus(Not_Found);
    return res.sendStatus(No_Content);
  }
}
