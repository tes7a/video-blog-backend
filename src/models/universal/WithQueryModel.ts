import { BlogDbModel } from "../blogs-models/BlogDbModel";

export type WithQueryModel<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
};
