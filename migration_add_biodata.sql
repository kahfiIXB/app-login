USE auth_app;

-- Bikin tabel biodata terpisah
CREATE TABLE IF NOT EXISTS biodata (
  user_id INT PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender ENUM('Laki-laki', 'Perempuan') NOT NULL,
  kelas VARCHAR(20) NOT NULL,
  jurusan VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
