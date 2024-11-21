import express from 'express';
import pool from '../config/database.js';
import { hashPassword, generateToken } from '../utils/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = hashPassword(password);
    
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?',
      [username, username, hashedPassword]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const user = users[0];
    const token = generateToken(user);
    
    res.json({
      success: true,
      token,
      role: user.role,
      username: user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error en el login' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Verificar si el usuario o email ya existe
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        error: 'El usuario o correo electrónico ya está registrado' 
      });
    }

    const hashedPassword = hashPassword(password);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    res.json({ success: true, userId: result.insertId });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error en el registro' });
  }
});

export default router;