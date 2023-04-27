export const validator = (value: string, length: number) => {
  if (value) {
    if (!value.trim()) {
      return false;
    } else if (value.length < length) {
      return false;
    }
  }

  return true;
};
