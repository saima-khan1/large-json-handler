import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 5001;

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

    response.data.on("error", (err: any) => {
      console.error("Stream error:", err);
      res.status(500).end();
    });

    response.data.pipe(res);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
