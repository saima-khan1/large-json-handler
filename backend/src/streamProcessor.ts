import { Request, Response } from "express";
import axios from "axios";
import jsonstream from "jsonstream";
import { processAndSendObject } from "./processData";

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
      timeout: 60000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    res.setHeader("Content-Type", "application/json");

    let accumulatedChunkRef = { value: "" };
    let totalChunkSizeRef = { value: 0 };
    const CHUNK_SIZE_LIMIT = 20 * 1024;
    let isFirstChunkRef = { value: true };

    if (!response.data) {
      res.json({ message: "not found" });
      return;
    }

    response.data
      .pipe(jsonstream.parse("*"))
      .on("data", (jsonData: string | Record<string, unknown> | null) => {
        if (Array.isArray(jsonData)) {
          jsonData.forEach((obj) =>
            processAndSendObject(
              obj,
              searchKeyword,
              res,
              accumulatedChunkRef,
              totalChunkSizeRef,
              CHUNK_SIZE_LIMIT,
              isFirstChunkRef
            )
          );
        } else {
          processAndSendObject(
            jsonData,
            searchKeyword,
            res,
            accumulatedChunkRef,
            totalChunkSizeRef,
            CHUNK_SIZE_LIMIT,
            isFirstChunkRef
          );
        }
      })
      .on("end", () => {
        if (accumulatedChunkRef.value) {
          res.write("[" + accumulatedChunkRef.value + "]");
        }
        res.end();
      })
      .on("error", (err: any) => {
        console.error("Stream error:", err);
        res.status(500).json({ error: "Failed to process stream" });
      });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
