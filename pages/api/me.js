import pool from "../../lib/db";
import { getUserFromReq } from "../../lib/auth";

export default async function handler(req, res) {
  const sessionUser = getUserFromReq(req);
  if (!sessionUser) {
    return res.status(401).json({ user: null });
  }

  try {
    const [rows] = await pool.query(
      `SELECT
         u.id, u.full_name, u.email,
         b.phone, b.address, b.birth_date, b.gender, b.kelas, b.jurusan
       FROM users u
       LEFT JOIN biodata b ON b.user_id = u.id
       WHERE u.id = ?`,
      [sessionUser.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ user: null });
    }

    const row = rows[0];
    // biodataCompleted = true kalau ada baris di tabel biodata (b.phone tidak null)
    const biodataCompleted = row.phone !== null;

    return res.status(200).json({
      user: {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        address: row.address,
        birthDate: row.birth_date,
        gender: row.gender,
        kelas: row.kelas,
        jurusan: row.jurusan,
        biodataCompleted,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ user: null });
  }
}
