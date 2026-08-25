import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const COOKIE_NAME = "session_token";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function setSessionCookie(res, token) {
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
  res.setHeader("Set-Cookie", cookie);
}

export function clearSessionCookie(res) {
  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  res.setHeader("Set-Cookie", cookie);
}

export function getUserFromReq(req) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifyToken(token);
}
