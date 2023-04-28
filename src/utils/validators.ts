export const errorWithMessage = (value: string, length: number) => {
  if (!value) {
    if (value.trim()) {
      return "Field should not be empty";
    } else if (value.length > length) {
      return "Too many characters";
    }
  }

  return "Bads Request";
};

export const validateField = (value: string, length: number) => {
  if (value) {
    if (value.trim()) {
      if (value.length < length) {
        return true;
      }
    }
  }

  return false;
};
