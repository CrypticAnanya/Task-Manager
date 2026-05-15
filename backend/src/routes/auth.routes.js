import { Router } from "express";

import { authenticate, requireAdmin } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { comparePassword, hashPassword, signToken } from "../utils/auth.js";
import { userDto } from "../utils/formatters.js";
import { loginSchema, signupSchema } from "../validators/schemas.js";

export const authRouter = Router();

function authResponse(user) {
  return { user: userDto(user), access: signToken(user), token: signToken(user), refresh: signToken(user) };
}

authRouter.post("/signup", async (req, res, next) => {
  try {
    const payload = signupSchema.parse(req.body);
    const user = await prisma.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        passwordHash: await hashPassword(payload.password),
        role: payload.role
      }
    });
    res.status(201).json(authResponse(user));
  } catch (error) {
    next(error);
  }
});

authRouter.post("/register", (req, res, next) => {
  req.url = "/signup";
  authRouter.handle(req, res, next);
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user || !(await comparePassword(payload.password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json(authResponse(user));
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", authenticate, (req, res) => {
  res.json(userDto(req.user));
});

authRouter.get("/users", authenticate, async (req, res) => {
  const users = await prisma.user.findMany({ orderBy: [{ role: "asc" }, { fullName: "asc" }] });
  res.json(users.map(userDto));
});

authRouter.post("/logout", authenticate, (req, res) => {
  res.status(204).send();
});

authRouter.patch("/users/:id/role", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const role = req.body.role === "ADMIN" ? "ADMIN" : "MEMBER";
    const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data: { role } });
    res.json(userDto(user));
  } catch (error) {
    next(error);
  }
});
