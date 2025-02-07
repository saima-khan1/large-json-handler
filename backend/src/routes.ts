import { Router } from "express";
import { streamProcessor } from "./streamProcessor";

export const baseRoutes = Router();

baseRoutes.get("/large-json-data", streamProcessor);
