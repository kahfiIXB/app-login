import pool from "../../lib/db";
import { getUserFromReq } from "../../lib/auth";

export default async function handler(req, res) {
  const sessionUser = getUserFromReq(req);
  if (!sessionUser) {
    return res.status(401).json({ message: "Belum login" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { phone, address, birthDate, gender, kelas, jurusan } = req.body;

  if (!phone || !address || !birthDate || !gender || !kelas || !jurusan) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  try {
    // user_id UNIQUE di tabel biodata, jadi kalau submit ulang, otomatis update
    await pool.query(
      `INSERT INTO biodata (user_id, phone, address, birth_date, gender, kelas, jurusan)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         phone = VALUES(phone),
         address = VALUES(address),
         birth_date = VALUES(birth_date),
         gender = VALUES(gender),
         kelas = VALUES(kelas),
         jurusan = VALUES(jurusan)`,
      [sessionUser.id, phone, address, birthDate, gender, kelas, jurusan]
    );

    return res.status(200).json({ message: "Biodata berhasil disimpan" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
