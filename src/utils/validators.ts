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
    valueAge?: string;
    valueResolution?: string[] | null;
  },
  length: {
    lengthTitle?: number;
    lengthAuthor?: number;
  },
  field: {
    title?: string;
    author?: string;
    availableResolutions?: string;
  }
) => {
  let errorMessages: any = {
    errorsMessages: [],
  };
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
  if (
    FieldValidate(values.valueAuthor!, length.lengthTitle!) ||
    FieldValidate(values.valueTitle!, length.lengthTitle!)
  )
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
  if (value > 0 && typeof value === "number") {
    if (value <= 18) return true;
  }
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
