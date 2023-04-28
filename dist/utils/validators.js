"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateField = exports.errorWithMessage = void 0;
const errorWithMessage = (value, length) => {
    if (!value) {
        if (value.trim()) {
            return "Field should not be empty";
        }
        else if (value.length > length) {
            return "Too many characters";
        }
    }
    return "Bads Request";
};
exports.errorWithMessage = errorWithMessage;
const validateField = (value, length) => {
    if (value) {
        if (value.trim()) {
            if (value.length < length) {
                return true;
            }
        }
    }
    return false;
};
exports.validateField = validateField;
