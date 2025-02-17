import { Request, Response } from "express";
import axios from "axios";
import jsonstream from "jsonstream";
import zlib from "zlib";
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
      timeout: 60000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Encoding", "gzip");

    const gzip = zlib.createGzip();

    response.data
      .pipe(jsonstream.parse("*"))
      .on("data", (jsonData: any) => {
        if (Array.isArray(jsonData)) {
          jsonData.forEach(processAndSendObject);
        } else {
          processAndSendObject(jsonData);
        }
      })
      .on("end", () => {
        // Final chunk after stream ends
        if (accumulatedChunk.length > 0) {
          gzip.write("[" + accumulatedChunk + "]");
        }
        gzip.end();
      })
      .on("error", (err: any) => {
        console.error("Stream error:", err);
        res.status(500).json({ error: "Failed to process stream" });
      });

    gzip.pipe(res);

    let accumulatedChunk = "";
    let totalChunkSize = 0;
    const CHUNK_SIZE_LIMIT = 1000 * 1024;
    let isFirstChunk = true;

    function processAndSendObject(obj: any) {
      if (!searchKeyword || searchObject(obj, searchKeyword)) {
        try {
          const jsonString = JSON.stringify(obj);

          if (accumulatedChunk.length > 0) {
            accumulatedChunk += ",";
          }

          accumulatedChunk += jsonString;
          totalChunkSize += Buffer.byteLength(jsonString, "utf8");

          if (totalChunkSize >= CHUNK_SIZE_LIMIT) {
            //gzip.write("[" + accumulatedChunk + "]");
            gzip.write(accumulatedChunk);
            accumulatedChunk = "";
            totalChunkSize = 0;
          }
        } catch (error) {
          console.error("Error processing JSON object:", error);
          res.status(500).end();
        }
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
