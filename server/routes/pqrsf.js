import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../utils/auth.js';
import { sendPQRSFResponse } from '../utils/email.js';

const router = express.Router();

// Crear PQRSF
router.post('/', async (req, res) => {
  try {
    const { nombre, celular, correo, descripcion, motivo } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO pqrsf (nombre, celular, correo, descripcion, motivo) VALUES (?, ?, ?, ?, ?)',
      [nombre, celular, correo, descripcion, motivo]
    );
    
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar PQRSF' });
  }
});

// Obtener todos los PQRSF (solo admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    const [pqrsfs] = await pool.execute(
      'SELECT * FROM pqrsf ORDER BY fecha_creacion DESC'
    );
    
    res.json(pqrsfs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener PQRSF' });
  }
});

// Obtener PQRSF del usuario actual
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const [pqrsfs] = await pool.execute(
      'SELECT * FROM pqrsf WHERE correo = (SELECT email FROM users WHERE id = ?) ORDER BY fecha_creacion DESC',
      [req.user.id]
    );
    
    res.json(pqrsfs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tus PQRSF' });
  }
});

// Actualizar estado y respuesta de PQRSF (solo admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    const { id } = req.params;
    const { estado, respuesta } = req.body;
    
    // Primero obtenemos el PQRSF actual para tener el correo del usuario
    const [pqrsfs] = await pool.execute(
      'SELECT * FROM pqrsf WHERE id = ?',
      [id]
    );

    if (pqrsfs.length === 0) {
      return res.status(404).json({ error: 'PQRSF no encontrado' });
    }

    const pqrsf = pqrsfs[0];
    
    // Actualizamos el PQRSF
    await pool.execute(
      'UPDATE pqrsf SET estado = ?, respuesta = ?, fecha_resolucion = NOW() WHERE id = ?',
      [estado, respuesta, id]
    );

    // Si el estado es resuelto, enviamos el correo
    if (estado === 'resuelto') {
      const updatedPQRSF = { ...pqrsf, estado, respuesta };
      await sendPQRSFResponse(pqrsf.correo, updatedPQRSF);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar PQRSF' });
  }
});

export default router;