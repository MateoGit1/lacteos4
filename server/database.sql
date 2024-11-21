CREATE DATABASE IF NOT EXISTS pqrsf_db;
USE pqrsf_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  reset_token VARCHAR(255),
  reset_token_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pqrsf (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  celular VARCHAR(20) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  motivo VARCHAR(50) NOT NULL,
  estado ENUM('pendiente', 'resuelto') DEFAULT 'pendiente',
  respuesta TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_resolucion TIMESTAMP
);

-- Insert default admin user with SHA-256 hashed password (admin123)
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@lacteosandinos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin');