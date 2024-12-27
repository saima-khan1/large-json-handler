import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import status from "express-status-monitor";
import zlib from "zlib";

const app = express();
const PORT = 5001;

app.use(status());

app.use(cors());
app.use(express.json());

app.get("/photos", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/photos",
      {
        responseType: "stream",
      }
    );

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Encoding", "gzip");

    const gzip = zlib.createGzip();
    response.data.pipe(gzip).pipe(res);

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
