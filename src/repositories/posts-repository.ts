import { posts } from "../db/posts.db";
import { PostType } from "../db/posts.db";

type argumentType = string | undefined;

export const postsRepository = {
  getBlogById(id: argumentType): PostType[] | PostType | undefined {
    if (id) return posts.find((p) => p.id === id);

    return posts;
  },

  deleteById(id: argumentType): boolean {
    if (id && posts.find((p) => p.id === id)) {
      posts.splice(
        posts.findIndex((p) => p.id === id),
        1
      );
      return true;
    }
    return false;
  },

  createPost(
    title: argumentType,
    shortDescription: argumentType,
    content: argumentType,
    blogId: argumentType
  ) {
    const newPost = {
      id: new Date().getMilliseconds().toString(),
      title: title!,
      shortDescription: shortDescription!,
      content: content!,
      blogId: blogId!,
      blogName: `Blog Name #`,
    };
    posts.push(newPost);
    return newPost;
  },

  updatePost(
    id: argumentType,
    title: argumentType,
    shortDescription: argumentType,
    content: argumentType,
    blogId: argumentType
  ) {
    let post = posts.find((p) => p.id === id);
    if (post) {
      post.title = title!;
      post.shortDescription = shortDescription!;
      post.content = content!;
      post.blogId = blogId!;
      return post;
    }
    return false;
  },
};
