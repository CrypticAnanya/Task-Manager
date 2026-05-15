import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(24, "JWT_SECRET must be at least 24 characters"),
  PORT: z.coerce.number().default(8000),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  NODE_ENV: z.string().default("development")
});

export const env = schema.parse(process.env);
