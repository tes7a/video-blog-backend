export type VideoUpdateModel = {
  /**
   * Model update object video
   */
  id?: number;
  title: string;
  author: string;
  canBeDownloaded?: boolean;
  minAgeRestriction?: number | null;
  createdAt?: string;
  publicationDate?: string;
  availableResolutions?: string[] | null;
};
