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
    const response = await axios({
      method: "get",
      url: sourceUrl,
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    const parser = jsonstream.parse("*");

    response.data.pipe(parser);

    parser.on("data", (chunk) => {
      try {
        if (searchKeyword) {
          const matches = searchObject(chunk, searchKeyword);
          if (matches) {
            return res.write(JSON.stringify(matches) + "\n");
          }
        }
        return res.write(JSON.stringify(chunk) + "\n");
      } catch (error) {
        console.error("Error processing chunk:", error);
      }
    });

    parser.on("end", () => {
      res.end();
    });

    parser.on("error", (err) => {
      console.error("Error parsing JSON stream:", err);
      res.status(500).send("Error processing data");
    });
  } catch (err) {
    console.error("Error fetching file:", err);
    res.status(500).send("Error fetching file");
  }
};
