// import { Request, Response } from "express";
// import axios from "axios";
// import jsonstream from "jsonstream";
// import zlib from "zlib";
// import { searchObject } from "./search";

// export const streamProcessor = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const sourceUrl = req.query.sourceUrl as string;
//   const searchKeyword = (req.query.search as string) || "";

//   if (!sourceUrl) {
//     res.status(400).json({ error: "No source URL provided" });
//     return;
//   }

//   try {
//     const response = await axios.get(sourceUrl, {
//       responseType: "stream",
//       timeout: 60000,
//       headers: { "User-Agent": "Mozilla/5.0" },
//     });

//     res.setHeader("Content-Type", "application/json");

//     let accumulatedChunk = "";
//     let totalChunkSize = 0;
//     const CHUNK_SIZE_LIMIT = 20 * 1024;
//     let isFirstChunk = true;

//     if (!response.data) {
//       res.json({ message: "not found" });
//       return;
//     }

//     response.data
//       .pipe(jsonstream.parse("*"))
//       .on("data", (jsonData: string | Record<string, unknown> | null) => {
//         if (Array.isArray(jsonData)) {
//           jsonData.forEach(processAndSendObject);
//         } else {
//           processAndSendObject(jsonData);
//         }
//       })
//       .on("end", () => {
//         if (accumulatedChunk) {
//           res.write("[" + accumulatedChunk + "]");
//         }

//         res.end();
//       })
//       .on("error", (err: any) => {
//         console.error("Stream error:", err);
//         res.status(500).json({ error: "Failed to process stream" });
//       });

//     function processAndSendObject(
//       obj: string | Record<string, unknown> | null
//     ) {
//       if (!searchKeyword || searchObject(obj, searchKeyword)) {
//         const jsonString = JSON.stringify(obj, null, 2);

//         if (!isFirstChunk) {
//           accumulatedChunk += ",";
//         }
//         isFirstChunk = false;

//         accumulatedChunk += jsonString;
//         totalChunkSize += jsonString.length;

//         if (totalChunkSize >= CHUNK_SIZE_LIMIT) {
//           try {
//             res.write(accumulatedChunk);
//             accumulatedChunk = "";
//             totalChunkSize = 0;
//           } catch (error) {
//             console.error("Error writing chunk:", error);
//             res.status(500).end();
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Failed to fetch data" });
//   }
// };
// import { Request, Response } from "express";
// import axios from "axios";
// import jsonstream from "jsonstream";
// import zlib from "zlib";
// import { searchObject } from "./search";

// export const streamProcessor = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const sourceUrl = req.query.sourceUrl as string;
//   const searchKeyword = (req.query.search as string) || "";

//   if (!sourceUrl) {
//     res.status(400).json({ error: "No source URL provided" });
//     return;
//   }

//   try {
//     const response = await axios.get(sourceUrl, {
//       responseType: "stream",
//       timeout: 60000,
//       headers: { "User-Agent": "Mozilla/5.0" },
//     });

//     res.setHeader("Content-Type", "application/json");
//     res.setHeader("Content-Encoding", "gzip");

//     const gzip = zlib.createGzip();

//     response.data
//       .pipe(jsonstream.parse("*"))
//       .on("data", (jsonData: string | Record<string, unknown> | null) => {
//         if (Array.isArray(jsonData)) {
//           jsonData.forEach(processAndSendObject);
//         } else {
//           processAndSendObject(jsonData);
//         }
//       })
//       .on("end", () => {
//         if (accumulatedChunk) {
//           gzip.write("[" + accumulatedChunk + "]");
//         }
//         gzip.end();
//       })
//       .on("error", (err: any) => {
//         console.error("Stream error:", err);
//         res.status(500).json({ error: "Failed to process stream" });
//       });

//     gzip.pipe(res);

//     let accumulatedChunk = "";
//     let totalChunkSize = 0;
//     const CHUNK_SIZE_LIMIT = 20 * 1024;
//     let isFirstChunk = true;

//     function processAndSendObject(
//       obj: string | Record<string, unknown> | null
//     ) {
//       if (!searchKeyword || searchObject(obj, searchKeyword)) {
//         const jsonString = JSON.stringify(obj, null, 2);

//         if (!isFirstChunk) {
//           accumulatedChunk += ",";
//         }
//         isFirstChunk = false;

//         accumulatedChunk += jsonString;
//         totalChunkSize += jsonString.length;

//         if (totalChunkSize >= CHUNK_SIZE_LIMIT) {
//           try {
//             gzip.write(accumulatedChunk);
//             accumulatedChunk = "";
//             totalChunkSize = 0;
//           } catch (error) {
//             console.error("Error writing chunk:", error);
//             res.status(500).end();
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Failed to fetch data" });
//   }
// };
import { Request, Response } from "express";
import axios from "axios";
import zlib from "zlib";

const CHUNK_SIZE = 500 * 1024;
const cache = new Map<string, string>();

export const streamProcessor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sourceUrl = req.query.sourceUrl as string;
  const start = parseInt(req.query.start as string, 10) || 0;
  const limit = CHUNK_SIZE;

  if (!sourceUrl) {
    res.status(400).json({ error: "No source URL provided" });
    return;
  }

  try {
    let jsonData = cache.get(sourceUrl);

    if (!jsonData) {
      const response = await axios({
        method: "get",
        url: sourceUrl,
        responseType: "text",
      });

      jsonData = response.data;
      cache.set(sourceUrl, jsonData as any);
    }

    const chunk = (jsonData as any).substring(start, start + limit);

    // Set response headers
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    // Send compressed chunk
    console.log(`Sending chunk: ${start} - ${start + chunk.length}`);
    res.write(zlib.gzipSync(chunk));
    res.end();
  } catch (error) {
    console.error("Error streaming JSON:", (error as Error).message);
    res.status(500).json({ error: "Failed to stream JSON file" });
  }
};
