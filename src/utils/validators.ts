import { log } from "console";
import { ErrorResponseModel } from "../models/ErrorResponseModel";

const returnErrorMessage = (message: string, field: string) => {
  return {
    errorsMessages: [
      {
        message,
        field,
      },
    ],
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
  value: string,
  length: number,
  field: string
) => {
  if (typeof value !== "string")
    return returnErrorMessage("Incorrect value", field);
  if (!value) return returnErrorMessage("Field should not be empty", field);
  if (value) {
    if (value.length > length) {
      return returnErrorMessage("Too many characters", field);
    }
  }
};

export const includeResolutionValidate = (value: string[]) => {
  if (value.every((v) => resolution.includes(v))) {
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
