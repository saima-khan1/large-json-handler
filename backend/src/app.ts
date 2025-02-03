import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: config.FRONTEND_URL,
    methods: "GET, POST, OPTIONS",
    allowedHeaders: "*",
  })
);
app.use(express.json());

app.use(routes);

export default app;
