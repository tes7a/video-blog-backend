import {
  AuthController,
  BlogsController,
  CommentsController,
  DevicesController,
  PostsController,
  TestingController,
} from "./controllers";
import { UsersController } from "./controllers/users-controller";
import {
  BlogsQueryRepository,
  BlogsRepository,
  CommentsRepository,
  DeviceRepository,
  PostCommentsQueryRepository,
  PostQueryRepository,
  PostsRepository,
  UsersQueryRepository,
  UsersRepository,
} from "./repositories";
import {
  AuthService,
  BlogsService,
  CommentsService,
  DeviceService,
  JwtService,
  PostService,
  UserService,
} from "./services";

//repositories
const blogsQueryRepository = new BlogsQueryRepository();
const postCommentsQueryRepository = new PostCommentsQueryRepository();
const postQueryRepository = new PostQueryRepository();
const usersQueryRepository = new UsersQueryRepository();

const blogsRepository = new BlogsRepository();
const commentsRepository = new CommentsRepository();
const deviceRepository = new DeviceRepository();
const postsRepository = new PostsRepository();
export const usersRepository = new UsersRepository();

//services
export const deviceService = new DeviceService(deviceRepository);
export const userService = new UserService(usersRepository);
export const jwtService = new JwtService();
export const authService = new AuthService(
  deviceService,
  deviceRepository,
  usersRepository,
  userService,
  jwtService
);
export const blogsService = new BlogsService(blogsRepository);
export const commentsService = new CommentsService(
  commentsRepository,
  jwtService
);
export const postService = new PostService(postsRepository);

//controllers
export const authController = new AuthController(
  authService,
  userService,
  jwtService
);
export const blogsController = new BlogsController(
  blogsService,
  blogsQueryRepository,
  postQueryRepository,
  postService
);
export const commentsController = new CommentsController(commentsService);
export const devicesController = new DevicesController(
  deviceService,
  jwtService
);
export const postsController = new PostsController(
  postCommentsQueryRepository,
  postQueryRepository,
  commentsService,
  postService,
  userService
);
export const testingController = new TestingController();
export const usersController = new UsersController(
  usersQueryRepository,
  userService
);
