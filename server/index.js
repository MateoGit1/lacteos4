import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import pqrsfRoutes from './routes/pqrsf.js';
import pool from './config/database.js';
import { hashPassword } from './utils/auth.js';

dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rutas
app.use('/api', authRoutes);
app.use('/api/pqrsf', pqrsfRoutes);

// Asegurar que el usuario admin existe
const setupAdminUser = async () => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = hashPassword(adminPassword);
  
  try {
    const [result] = await pool.execute(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, 'admin']
    );
    
    if (result.affectedRows === 0) {
      await pool.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@lacteosandinos.com', hashedPassword, 'admin']
      );
    }
    
    console.log('Admin user setup completed');
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
};

setupAdminUser();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});