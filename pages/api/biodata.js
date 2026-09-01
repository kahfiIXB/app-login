import pool from "../../lib/db";
import { getUserFromReq } from "../../lib/auth";

export default async function handler(req, res) {
  const sessionUser = getUserFromReq(req);

  if (!sessionUser) {
    return res.status(401).json({
      message: "Belum login",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const {
    full_name,
    phone,
    address,
    birthDate,
    gender,
    kelas,
    jurusan,
  } = req.body;

  if (
    !full_name ||
    !phone ||
    !address ||
    !birthDate ||
    !gender ||
    !kelas ||
    !jurusan
  ) {
    return res.status(400).json({
      message: "Semua field wajib diisi",
    });
  }

  try {
    // =========================
    // UPDATE FULL NAME DI USERS
    // =========================

    await pool.query(
      `
      UPDATE users
      SET full_name = ?
      WHERE id = ?
      `,
      [full_name, sessionUser.id]
    );

    // =========================
    // INSERT / UPDATE BIODATA
    // =========================

    await pool.query(
      `
      INSERT INTO biodata
        (user_id, phone, address, birth_date, gender, kelas, jurusan)
      VALUES
        (?, ?, ?, ?, ?, ?, ?)

      ON DUPLICATE KEY UPDATE
        phone = VALUES(phone),
        address = VALUES(address),
        birth_date = VALUES(birth_date),
        gender = VALUES(gender),
        kelas = VALUES(kelas),
        jurusan = VALUES(jurusan)
      `,
      [
        sessionUser.id,
        phone,
        address,
        birthDate,
        gender,
        kelas,
        jurusan,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Biodata berhasil disimpan",
    });

  } catch (err) {
    console.error("BIODATA ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
}