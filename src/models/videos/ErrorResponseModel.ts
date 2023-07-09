export type ErrorResponseModel = {
  errorsMessages:
    | [
        {
          message?: string | undefined;
          field?: string | undefined;
        }
      ]
    | [];
};
