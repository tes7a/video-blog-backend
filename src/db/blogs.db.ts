export type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
};

export let blogs: BlogType[] = [
  {
    id: "1",
    name: "Costas",
    description: "My Blog #1",
    websiteUrl: "https://myBlogs/1",
  },
  {
    id: "2",
    name: "Costas",
    description: "My Blog #2",
    websiteUrl: "https://myBlogs/2",
  },
];
