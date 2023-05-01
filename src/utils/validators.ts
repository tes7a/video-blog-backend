import { ErrorResponseModel } from "../models/ErrorResponseModel";

const returnErrorMessage = (message: string, field: string) => {
  return {
    message,
    field,
  };
};

const resolution = [
  "P144",
  "P240",
  "P360",
  "P480",
  "P720",
  "P1080",
  "P1440",
  "P2160",
];

export const errorMessageValidate = (
  values: {
    valueTitle?: string;
    valueAuthor?: string;
    valueAge?: number | null;
    valueResolution?: string[] | null;
    valueCanBeDownloaded?: boolean;
    valueDate?: string;
  },
  length: {
    lengthTitle?: number;
    lengthAuthor?: number;
  },
  field: {
    title?: string;
    author?: string;
    availableResolutions?: string;
    minAgeRestriction?: string;
    canBeDownloaded?: string;
    publicationDate?: string;
  }
) => {
  let errorMessages: any = {
    errorsMessages: [],
  };
  if (values.valueDate && typeof values.valueDate !== "string") {
    errorMessages.errorsMessages.push(
      returnErrorMessage("Incorrect value", field.publicationDate!)
    );
  }
  if (
    values.valueCanBeDownloaded &&
    typeof values.valueCanBeDownloaded !== "boolean"
  ) {
    errorMessages.errorsMessages.push(
      returnErrorMessage("Incorrect value", field.canBeDownloaded!)
    );
  }
  if (values.valueAge && !AgeValidate(values.valueAge)) {
    errorMessages.errorsMessages.push(
      returnErrorMessage("Incorrect value", field.minAgeRestriction!)
    );
  }
  if (field?.availableResolutions === "availableResolutions") {
    if (
      !Array.isArray(values.valueResolution) ||
      !values.valueResolution.every((v) => resolution.includes(v))
    ) {
      errorMessages.errorsMessages.push(
        returnErrorMessage("Incorrect value", field.availableResolutions)
      );
    }
  }
  if (!FieldValidate(values.valueTitle!, length.lengthTitle!))
    errorMessages.errorsMessages.push(
      returnErrorMessage("Incorrect value", field.title!)
    );
  if (!FieldValidate(values.valueAuthor!, length.lengthAuthor!))
    errorMessages.errorsMessages.push(
      returnErrorMessage("Incorrect value", field.author!)
    );
  return errorMessages;
};

export const includeResolutionValidate = (value: string[]) => {
  if (Array.isArray(value) && value.every((v) => resolution.includes(v))) {
    return true;
  }
  return false;
};

export const AgeValidate = (value: number) => {
  if (value > 0 && value <= 18 && typeof value === "number") return true;
  return false;
};

export const FieldValidate = (value: string, length: number) => {
  if (value && typeof value === "string") {
    if (value.trim()) {
      if (value.length < length) {
        return true;
      }
    }
  }

  return false;
};
