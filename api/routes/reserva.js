const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET: Listar todas as reservas
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reserva');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar reservas:', err);
        res.status(500).send('Erro ao buscar reservas');
    }
});

// POST: Adicionar uma nova reserva
router.post('/', async (req, res) => {
    const { data_reserva, status, cliente_id, quarto_id } = req.body;
    try {
        const result = await pool.query('INSERT INTO reserva (data_reserva, status, cliente_id, quarto_id) VALUES ($1, $2, $3, $4) RETURNING *', [data_reserva, status, cliente_id, quarto_id]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar reserva:', err);
        res.status(400).send('Erro ao adicionar reserva');
    }
});

// POST reserva: não precisa adicionar a data de check-in-out, mas é necessário 
// ADD check-in-out: adicionar um uma página de validar o check-in e validar o check-out
// router.post('/api/reserva', async (req, res) => {
//     const { id, data_reserva, status, cliente_id, quarto_id } = req.body;
//     try {
//         const result = await pool.query('INSERT INTO reserva (data_reserva, data_checkin, data_checkout, status, cliente_id, quarto_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [data_reserva, data_checkin, data_checkout, status, cliente_id, quarto_id]);
//         res.status(201).json(result.rows[0]);
//     } catch (err) {
//         console.error('Erro ao adicionar reserva:', err);
//         res.status(400).send('Erro ao adicionar reserva');
//     }
// });

module.exports = router;