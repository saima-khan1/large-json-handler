import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import { baseRoutes } from "./routes";
import bodyParser from "body-parser";

const app = express();

// const corsConfig = cors({
//   origin: config.FRONTEND_URL,
//   methods: "GET, POST, OPTIONS",
//   allowedHeaders: "*",
// });

const originWhitelist = [
  "http://localhost:5173",
  "https://large-json-handler-client-dun.vercel.app",
  "null",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (originWhitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use(baseRoutes);

export default app;
