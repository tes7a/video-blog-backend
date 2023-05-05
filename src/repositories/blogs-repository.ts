import { BlogType } from "../db/blogs.db";
import { blogs } from "../db/blogs.db";

type argumentType = string | undefined;

export const blogsRepository = {
  getBlogById(id: argumentType): BlogType[] | BlogType | undefined {
    if (id) return blogs.find((b) => b.id === id);

    return blogs;
  },
  deleteById(id: argumentType): boolean {
    if (id && blogs.find((v) => v.id === id)) {
      blogs.splice(
        blogs.findIndex((v) => v.id === id),
        1
      );
      return true;
    }
    return false;
  },
  createdBlog(
    name: argumentType,
    description: argumentType,
    websiteUrl: argumentType
  ) {
    const newBlog = {
      id: new Date().getMilliseconds().toString(),
      name: name!,
      description: description!,
      websiteUrl: websiteUrl!,
    };
    blogs.push(newBlog);
    return newBlog;
  },
};
