export const searchObject = (
  obj: string | Record<string, unknown> | null,
  keyword: string
): boolean => {
  if (obj === null) {
    return false;
  }

  if (typeof obj === "string") {
    return obj.toLowerCase().includes(keyword.toLowerCase());
  }
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      searchObject(obj[key] as string | Record<string, unknown> | null, keyword)
    ) {
      return true;
    }
  }

  return false;
};
