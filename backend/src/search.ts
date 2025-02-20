export function searchObject(
  jsonStream:
    | string
    | Record<string, unknown>
    | Array<string | Record<string, unknown> | null>,
  keyword: string
): Array<string | Record<string, unknown> | null> {
  if (!keyword || keyword.trim() === "") {
    return [];
  }

  const normalizedKeyword = keyword.toLowerCase();

  if (typeof jsonStream === "string") {
    try {
      if (
        jsonStream.trim().startsWith("{") ||
        jsonStream.trim().startsWith("[")
      ) {
        const parsed = JSON.parse(jsonStream);

        if (Array.isArray(parsed)) {
          return searchArrayItems(parsed, normalizedKeyword);
        } else if (typeof parsed === "object" && parsed !== null) {
          return JSON.stringify(parsed)
            .toLowerCase()
            .includes(normalizedKeyword)
            ? [parsed]
            : [];
        }
      }

      return jsonStream.toLowerCase().includes(normalizedKeyword)
        ? [jsonStream]
        : [];
    } catch (e) {
      return jsonStream.toLowerCase().includes(normalizedKeyword)
        ? [jsonStream]
        : [];
    }
  }

  if (
    typeof jsonStream === "object" &&
    !Array.isArray(jsonStream) &&
    jsonStream !== null
  ) {
    const objString = JSON.stringify(jsonStream).toLowerCase();
    return objString.includes(normalizedKeyword) ? [jsonStream] : [];
  }

  if (Array.isArray(jsonStream)) {
    return searchArrayItems(jsonStream, normalizedKeyword);
  }

  return [];
}

function searchArrayItems(
  items: Array<string | Record<string, unknown> | null>,
  normalizedKeyword: string
): Array<string | Record<string, unknown> | null> {
  return items.filter((item) => {
    if (item === null) {
      return false;
    }

    if (typeof item === "string") {
      return item.toLowerCase().includes(normalizedKeyword);
    }

    const itemString = JSON.stringify(item).toLowerCase();
    return itemString.includes(normalizedKeyword);
  });
}
