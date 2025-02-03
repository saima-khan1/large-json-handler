export const searchObject = (obj: any, keyword: string): boolean => {
  if (typeof obj === "string") {
    return obj.toLowerCase().includes(keyword.toLowerCase());
  }
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && searchObject(obj[key], keyword)) {
        return true;
      }
    }
  }
  return false;
};
