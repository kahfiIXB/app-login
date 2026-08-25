import bcrypt from "bcryptjs";
import pool from "../../lib/db";
import { signToken, setSessionCookie } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password minimal 6 karakter" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
      [fullName, email, hashedPassword]
    );

    const token = signToken({ id: result.insertId, email, fullName });
    setSessionCookie(res, token);

    return res.status(201).json({
      message: "Registrasi berhasil",
      user: { id: result.insertId, email, fullName },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
