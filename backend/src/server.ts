import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import status from "express-status-monitor";
import { config } from "./config";

const app = express();
const PORT = config.port;
const API_URL = config.apiUrl;

app.use(status());
app.use(cors());
app.use(express.json());

app.get("/large-json-data", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(API_URL, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/json");

    let accumulatedChunk = "";
    let isFirstChunk = true;
    let totalChunkSize = 0;

    response.data.on("data", (chunk: any) => {
      accumulatedChunk += chunk.toString();
      totalChunkSize += chunk.length;

      if (totalChunkSize >= 20 * 1024) {
        if (!isFirstChunk) res.write(",");
        res.write(accumulatedChunk);
        accumulatedChunk = "";
        totalChunkSize = 0;
        isFirstChunk = false;
      }
    });

    response.data.on("end", () => {
      if (accumulatedChunk) {
        if (!isFirstChunk) res.write(",");
        res.write(accumulatedChunk);
      }
      res.write("]");
      res.end();
    });

    response.data.on("error", (err: any) => {
      console.error("Stream error:", err);
      res.status(500).end();
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
