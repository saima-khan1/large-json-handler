import { Router } from "express";
import { handleLargeJsonData } from "./streamProcessor";

const router = Router();

router.get("/large-json-data", handleLargeJsonData);

export default router;
