"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const validator = (value, length) => {
    if (!value) {
        if (value.trim()) {
            return "Field should not be empty";
        }
        else if (value.length > length) {
            return "Too many characters";
        }
    }
    return false;
};
exports.validator = validator;
