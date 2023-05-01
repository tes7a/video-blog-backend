"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldValidate = exports.AgeValidate = exports.includeResolutionValidate = exports.errorMessageValidate = void 0;
const returnErrorMessage = (message, field) => {
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
const errorMessageValidate = (value, length, field) => {
    if (typeof value !== "string")
        return returnErrorMessage("Incorrect value", field);
    if (!value)
        return returnErrorMessage("Field should not be empty", field);
    if (value) {
        if (value.length > length) {
            return returnErrorMessage("Too many characters", field);
        }
    }
};
exports.errorMessageValidate = errorMessageValidate;
const includeResolutionValidate = (value) => {
    if (Array.isArray(value) && value.every((v) => resolution.includes(v))) {
        return true;
    }
    return false;
};
exports.includeResolutionValidate = includeResolutionValidate;
const AgeValidate = (value) => {
    if (value > 0 && typeof value === "number") {
        if (value <= 18)
            return true;
    }
    return false;
};
exports.AgeValidate = AgeValidate;
const FieldValidate = (value, length) => {
    if (value && typeof value === "string") {
        if (value.trim()) {
            if (value.length < length) {
                return true;
            }
        }
    }
    return false;
};
exports.FieldValidate = FieldValidate;
