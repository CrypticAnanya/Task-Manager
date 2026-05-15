import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.JWT_SECRET, {
    expiresIn: "7d"
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}
