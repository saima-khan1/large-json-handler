import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import { baseRoutes } from "./routes";

const app = express();

const corsConfig = cors({
  origin: config.FRONTEND_URL,
  methods: "GET, POST, OPTIONS",
  allowedHeaders: "*",
});

app.use(corsConfig);

app.use(express.json());

app.use(baseRoutes);

export default app;
