import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import JSONStream from "jsonstream";
import status from "express-status-monitor";
import { config } from "./config";

const app = express();
const PORT = config.port;
const API_URL = config.apiUrl;

app.use(status());
app.use(cors());
app.use(express.json());

const searchObject = (obj: any, keyword: string): boolean => {
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

app.get("/large-json-data", async (req: Request, res: Response) => {
  const searchKeyword = (req.query.search as string) || "";

  try {
    const response = await axios.get(API_URL, { responseType: "stream" });

    res.setHeader("Content-Type", "application/json");

    let accumulatedChunk = "";
    let totalChunkSize = 0;
    const CHUNK_SIZE_LIMIT = 20 * 1024;
    let isFirstChunk = true;

    response.data
      .pipe(JSONStream.parse("*"))
      .on("data", (jsonData: any) => {
        if (Array.isArray(jsonData)) {
          jsonData.forEach(processAndSendObject);
        } else {
          processAndSendObject(jsonData);
        }
      })
      .on("end", () => {
        if (accumulatedChunk) {
          res.write(accumulatedChunk);
        }
        res.end();
      })
      .on("error", (err: any) => {
        console.error("Stream error:", err);
        res.status(500).end();
      });

    function processAndSendObject(obj: any) {
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
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
