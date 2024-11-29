const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { broadcastUpdate } = require('../helpers/websocket');

// GET: Listar todas as reservas
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reserva ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar reservas:', err);
        res.status(500).send('Erro ao buscar reservas');
    }
});

// POST: Adicionar uma nova reserva
router.post('/', async (req, res) => {
    const { date_reserva, data_checkin, data_checkout, cliente_id, room_number } = req.body;

    try {
        const resultQuarto = await pool.query('SELECT id FROM quarto WHERE numero = $1', [room_number]);
        if (resultQuarto.rows.length === 0) {
            return res.status(404).send('Quarto não encontrado');
        }

        // Atualiza o status do quarto para 'reservado'
        await pool.query('UPDATE quarto SET status_quarto = $1 WHERE numero = $2', ["reservado", room_number]);
        const quarto_id = resultQuarto.rows[0].id;

        // Cria a reserva
        const resultReserva = await pool.query(
            'INSERT INTO reserva (data_reserva, data_checkin, data_checkout, status, cliente_id, quarto_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [date_reserva, data_checkin, data_checkout, 'ativa', cliente_id, quarto_id]
        );

        // Envia uma atualização via WebSocket para todos os clientes conectados
        broadcastUpdate({
            type: 'reservationUpdate',
            status: 'created',
            roomNumber: room_number
        });

        res.status(201).json(resultReserva.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar reserva:', err);
        res.status(400).send('Erro ao adicionar reserva');
    }
});

// PUT: Cancelar uma reserva
router.put('/cancelar', async (req, res) => {
    const { reserva_id, quarto_id } = req.body;

    try {
        await pool.query('UPDATE quarto SET status_quarto = $1 WHERE id = $2', ['disponível', quarto_id]);
        const resultReserva = await pool.query('UPDATE reserva SET status = $1 WHERE id = $2', ['cancelada', reserva_id]);

        // Envia uma atualização via WebSocket para todos os clientes conectados
        broadcastUpdate({
            type: 'reservationUpdate',
            status: 'canceled',
            roomId: quarto_id
        });

        res.status(201).json(resultReserva.rows[0]);
    } catch (err) {
        console.error('Erro ao cancelar reserva:', err);
        res.status(400).send('Erro ao cancelar reserva');
    }
});

// PUT: Confirmar uma reserva
router.put('/confirmar', async (req, res) => {
    const { reserva_id, quarto_id } = req.body;

    try {
        await pool.query('UPDATE quarto SET status_quarto = $1 WHERE id = $2', ['ocupado', quarto_id]);
        const resultReserva = await pool.query('UPDATE reserva SET status = $1 WHERE id = $2', ['conclu¡da', reserva_id]);

        // Envia uma atualização via WebSocket para todos os clientes conectados
        broadcastUpdate({
            type: 'reservationUpdate',
            status: 'confirmed',
            roomId: quarto_id
        });

        res.status(201).json(resultReserva.rows[0]);
    } catch (err) {
        console.error('Erro ao confirmar reserva:', err);
        res.status(400).send('Erro ao confirmar reserva');
    }
});

module.exports = router;