export type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
};

export let posts: PostType[] = [
  {
    id: "1",
    title: "My life",
    shortDescription: "About Life",
    content: "Animals",
    blogId: "1",
    blogName: "Animal in life",
  },
  {
    id: "2",
    title: "My vehicle",
    shortDescription: "About cars",
    content: "cars",
    blogId: "2",
    blogName: "Rebuild my car",
  },
];
