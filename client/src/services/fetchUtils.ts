export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const fetchJsonChunks = async (
  baseUrl: string,
  url: string,
  search?: string
): Promise<string[]> => {
  if (!isValidUrl(url)) {
    throw new Error("Please enter a valid URL.");
  }

  const apiUrl = `${baseUrl}/large-json-data?sourceUrl=${encodeURIComponent(
    url
  )}${search ? `&search=${encodeURIComponent(search)}` : ""}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No readable stream available");
  }

  const decoder = new TextDecoder();
  let done = false;
  let accumulatedData = "";
  const newChunks: string[] = [];

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    done = streamDone;
    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      accumulatedData += chunk;
      newChunks.push(accumulatedData);
      accumulatedData = "";
    }
  }
  return newChunks;
};
