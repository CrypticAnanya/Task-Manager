import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { env } from "./config/env.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { projectsRouter } from "./routes/projects.routes.js";
import { tasksRouter } from "./routes/tasks.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 600 }));

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/users", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(notFound);
app.use(errorHandler);
