USE auth_app;

-- Bikin tabel biodata terpisah
CREATE TABLE IF NOT EXISTS biodata (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender ENUM('Laki-laki', 'Perempuan') NOT NULL,
  kelas VARCHAR(20) NOT NULL,
  jurusan VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
