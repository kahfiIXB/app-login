import bcrypt from "bcryptjs";
import pool from "../../lib/db";
import { signToken, setSessionCookie } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT u.*, b.phone AS biodata_phone
       FROM users u
       LEFT JOIN biodata b ON b.user_id = u.id
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
    });
    setSessionCookie(res, token);

    return res.status(200).json({
      message: "Login berhasil",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        biodataCompleted: user.biodata_phone !== null, // true kalau sudah ada baris di tabel biodata
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
