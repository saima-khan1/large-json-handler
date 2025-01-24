import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  apiUrl: process.env.API_URL || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
};
