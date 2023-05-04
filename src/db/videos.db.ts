export type VideosType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: string[] | null;
  };
  
  export let videos: VideosType[] = [
    {
      id: 0,
      title: "About my Life",
      author: "Costas",
      canBeDownloaded: true,
      minAgeRestriction: 18,
      createdAt: "2023-04-27T17:17:21.510Z",
      publicationDate: "2023-04-27T17:17:21.510Z",
      availableResolutions: ["P144"],
    },
    {
      id: 1,
      title: "Video Blog №1",
      author: "Costas",
      canBeDownloaded: true,
      minAgeRestriction: 18,
      createdAt: "2023-05-27T17:17:21.510Z",
      publicationDate: "2023-05-27T17:17:21.510Z",
      availableResolutions: ["P144"],
    },
    {
      id: 2,
      title: "Video Blog №2",
      author: "Costas",
      canBeDownloaded: true,
      minAgeRestriction: 18,
      createdAt: "2023-06-27T17:17:21.510Z",
      publicationDate: "2023-06-27T17:17:21.510Z",
      availableResolutions: ["P144"],
    },
  ];