export type VideoCreateModel = {
  /**
   * Video creation model
   */
  id: number;
  title: string;
  author: string;
  canBeDownloaded?: boolean;
  minAgeRestriction?: number | null;
  createdAt?: string;
  publicationDate?: string;
  availableResolutions?: string[] | null;
};
