"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const validator = (value, length) => {
    if (value) {
        if (!value.trim()) {
            return false;
        }
        else if (value.length < length) {
            return false;
        }
    }
    return true;
};
exports.validator = validator;
