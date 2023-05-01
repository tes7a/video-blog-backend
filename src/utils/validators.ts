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
  if (typeof values.valueAuthor !== "string")
    errorMessages.errorsMessages.push(
      returnErrorMessage("Incorrect value", field.author!)
    );
  if (typeof values.valueTitle !== "string") {
    errorMessages.errorsMessages.push(
      returnErrorMessage("Incorrect value", field.title!)
    );
  }
  if (!values.valueTitle)
    errorMessages.errorsMessages.push(
      returnErrorMessage("Field should not be empty", field.title!)
    );
  if (!values.valueAuthor)
    errorMessages.errorsMessages.push(
      returnErrorMessage("Field should not be empty", field.author!)
    );
  if (values.valueAuthor) {
    if (values.valueAuthor.length > length.lengthAuthor!) {
      errorMessages.errorsMessages.push(
        returnErrorMessage("Too many characters", field.author!)
      );
    }
  }
  if (values.valueTitle) {
    if (values.valueTitle.length > length.lengthTitle!) {
      errorMessages.errorsMessages.push(
        returnErrorMessage("Too many characters", field.title!)
      );
    }
  }
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
