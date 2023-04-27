"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInfo = void 0;
const validateInfo = (value, length) => {
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
exports.validateInfo = validateInfo;
