import { ZodError } from "zod";

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error instanceof ZodError) {
    return res.status(422).json({ message: "Validation failed", errors: error.flatten().fieldErrors });
  }
  if (error.code === "P2002") {
    return res.status(409).json({ message: "A record with that value already exists" });
  }
  console.error(error);
  res.status(error.status ?? 500).json({ message: error.message ?? "Server error" });
}
