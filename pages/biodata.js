import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Biodata.module.css";

export default function BiodataPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    address: "",
    birthDate: "",
    gender: "",
    kelas: "",
    jurusan: "",
  });

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/auth?mode=login");
          return;
        }

        if (data.user.biodataCompleted) {
          setIsEditing(true);
          setForm({
            phone: data.user.phone || "",
            address: data.user.address || "",
            birthDate: data.user.birthDate || "",
            gender: data.user.gender || "",
            kelas: data.user.kelas || "",
            jurusan: data.user.jurusan || "",
          });
        }

        setChecking(false);
      });
  }, [router]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/biodata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return <div className={styles.center}>Memuat...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>{isEditing ? "Edit Biodata" : "Lengkapi Biodata"}</h1>
        <p className={styles.subtitle}>
          {isEditing
            ? "Ubah data diri kamu di bawah ini."
            : "Isi data diri kamu dulu ya, cuma perlu sekali aja kok."}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>No. HP/Telepon</label>
            <input
              type="tel"
              placeholder="08xxxxxxxxxx"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Alamat</label>
            <textarea
              placeholder="Alamat lengkap"
              required
              rows={2}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Tanggal Lahir</label>
              <input
                type="date"
                required
                value={form.birthDate}
                onChange={(e) => update("birthDate", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Jenis Kelamin</label>
              <select
                required
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Kelas</label>
              <input
                type="text"
                placeholder="Misal: XII"
                required
                value={form.kelas}
                onChange={(e) => update("kelas", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Jurusan</label>
              <input
                type="text"
                placeholder="Misal: RPL"
                required
                value={form.jurusan}
                onChange={(e) => update("jurusan", e.target.value)}
              />
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading
              ? "Menyimpan..."
              : isEditing
              ? "SIMPAN PERUBAHAN"
              : "SIMPAN & LANJUT"}
          </button>

          {isEditing && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => router.push("/dashboard")}
            >
              Batal
            </button>
          )}
        </form>
      </div>
    </div>
  );
}