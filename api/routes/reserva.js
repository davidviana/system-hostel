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
    const { date_reserva, data_checkin, data_checkout, cliente_id, room_number } = req.body;
    
    let status = 'ativa';

    try {
        const resultQuarto = await pool.query('SELECT id FROM quarto WHERE numero = $1', [room_number]);
        if (resultQuarto.rows.length === 0) {
            return res.status(404).send('Quarto não encontrado');
        }

        const quarto_id = resultQuarto.rows[0].id;

        const resultReserva = await pool.query(
            'INSERT INTO reserva (data_reserva, data_checkin, data_checkout, status, cliente_id, quarto_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [date_reserva, data_checkin, data_checkout, status, cliente_id, quarto_id]
        );

        res.status(201).json(resultReserva.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar reserva:', err);
        res.status(400).send('Erro ao adicionar reserva');
    }
});

module.exports = router;
