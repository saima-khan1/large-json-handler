import { Request, Response } from "express";
import axios from "axios";
import jsonstream from "jsonstream";
import { searchObject } from "./search";

export const streamProcessor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sourceUrl = req.query.sourceUrl as string;
  const searchKeyword = (req.query.search as string) || "";

  if (!sourceUrl) {
    res.status(400).json({ error: "No source URL provided" });
    return;
  }

  try {
    const response = await axios.get(sourceUrl, {
      responseType: "stream",
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    res.setHeader("Content-Type", "application/json");

    let accumulatedChunk = "";
    let totalChunkSize = 0;
    const CHUNK_SIZE_LIMIT = 20 * 1024;
    let isFirstChunk = true;

    if (!response.data) {
      res.json({ message: "not found" });
      return;
    }

    response.data
      .pipe(jsonstream.parse("*"))
      .on("data", (jsonData: string | Record<string, unknown> | null) => {
        if (Array.isArray(jsonData)) {
          jsonData.forEach(processAndSendObject);
        } else {
          processAndSendObject(jsonData);
        }
      })
      .on("end", () => {
        if (accumulatedChunk) {
          res.write("[" + accumulatedChunk + "]");
        }

        res.end();
      })
      .on("error", (err: any) => {
        console.error("Stream error:", err);
        res.status(500).json({ error: "Failed to process stream" });
      });

    function processAndSendObject(
      obj: string | Record<string, unknown> | null
    ) {
      if (!searchKeyword || searchObject(obj, searchKeyword)) {
        const jsonString = JSON.stringify(obj, null, 2);

        if (!isFirstChunk) {
          accumulatedChunk += ",";
        }
        isFirstChunk = false;

        accumulatedChunk += jsonString;
        totalChunkSize += jsonString.length;

        if (totalChunkSize >= CHUNK_SIZE_LIMIT) {
          try {
            res.write(accumulatedChunk);
            accumulatedChunk = "";
            totalChunkSize = 0;
          } catch (error) {
            console.error("Error writing chunk:", error);
            res.status(500).end();
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

// Add pagination
