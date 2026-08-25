-- Jalankan file ini di HeidiSQL / phpMyAdmin bawaan Laragon
-- (klik kanan tray Laragon -> Database, atau buka HeidiSQL lalu Load SQL file ini)

CREATE DATABASE IF NOT EXISTS auth_app;
USE auth_app;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
