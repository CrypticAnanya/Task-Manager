import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../utils/auth.js";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Authentication required" });

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
