import { Response } from "express";
import { searchObject } from "./search";

export function processAndSendObject(
  obj: string | Record<string, unknown> | null,
  searchKeyword: string,
  res: Response,
  accumulatedChunkRef: { value: string },
  totalChunkSizeRef: { value: number },
  CHUNK_SIZE_LIMIT: number,
  isFirstChunkRef: { value: boolean }
): void {
  if (!searchKeyword || searchObject(obj, searchKeyword)) {
    const jsonString = JSON.stringify(obj, null, 2);

    if (!isFirstChunkRef.value) {
      accumulatedChunkRef.value += ",";
    }
    isFirstChunkRef.value = false;

    accumulatedChunkRef.value += jsonString;
    totalChunkSizeRef.value += jsonString.length;

    if (totalChunkSizeRef.value >= CHUNK_SIZE_LIMIT) {
      try {
        res.write(accumulatedChunkRef.value);
        accumulatedChunkRef.value = "";
        totalChunkSizeRef.value = 0;
      } catch (error) {
        console.error("Error writing chunk:", error);
        res.status(500).end();
      }
    }
  }
}
