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
        res.status(500).send('Erro ao buscar reservas');
    }
});

// GET: Listar todas as reservas, por cliente
router.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const result = await pool.query('SELECT * FROM reserva WHERE cliente_id = $1 ORDER BY id DESC', [id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Erro ao buscar reservas');
    }
});

// POST: Adicionar uma nova reserva
router.post('/', async (req, res) => {
    const { date_reserva, data_checkin, data_checkout, cliente_id, room_number, dias_de_estadia, total_value } = req.body;

    try {
        // Atualiza o status do quarto para 'reservado'
        await pool.query('UPDATE quarto SET status_quarto = $1 WHERE numero = $2', ["reservado", room_number]);

        // Cria a reserva
        const resultReserva = await pool.query(
            'INSERT INTO reserva (data_reserva, data_checkin, data_checkout, status, cliente_id, quarto_id, dias_de_estadia, is_checkin, is_checkout, total_value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [date_reserva, data_checkin, data_checkout, 'ativa', cliente_id, room_number, dias_de_estadia, 'false', 'false', total_value]
        );

        // Envia uma atualização via WebSocket para todos os clientes conectados
        broadcastUpdate({
            type: 'reservationUpdate',
            status: 'created',
            dataCheckin: data_checkin,
            dataCheckout: data_checkout,
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
    const { reserva_id, room_number } = req.body;

    try {
        await pool.query('UPDATE quarto SET status_quarto = $1 WHERE numero = $2', ['disponível', room_number]);
        const resultReserva = await pool.query('UPDATE reserva SET status = $1 WHERE id = $2', ['cancelada', reserva_id]);

        broadcastUpdate({
            type: 'reservationUpdate',
            status: 'canceled',
            roomId: room_number
        });

        res.status(201).json(resultReserva.rows[0]);
    } catch (err) {
        res.status(400).send('Erro ao cancelar reserva');
    }
});

// PUT: Confirmar uma reserva + checkin
router.put('/confirmar', async (req, res) => {
    const { reserva_id, room_number } = req.body;

    try {
        await pool.query('UPDATE quarto SET status_quarto = $1 WHERE numero = $2', ['ocupado', room_number]);
        const resultReserva = await pool.query('UPDATE reserva SET status = $1, is_checkin = $2, is_checkout = $3 WHERE id = $4', ['conclu¡da', 'true', 'false',reserva_id]);

        broadcastUpdate({
            type: 'reservationUpdate',
            status: 'confirmed',
            roomId: room_number
        });

        res.status(201).json(resultReserva.rows[0]);
    } catch (err) {
        res.status(400).send('Erro ao confirmar reserva');
    }
});

// PUT: Confirmar o checkout da reserva
router.put('/checkout', async (req, res) => {
    const { reserva_id, room_number } = req.body;

    try {
        await pool.query('UPDATE quarto SET status_quarto = $1 WHERE numero = $2', ['disponível',room_number]);
        const resultReserva = await pool.query('UPDATE reserva SET status = $1, is_checkout = $2 WHERE id = $3', ['conclu¡da','true', reserva_id]);

        broadcastUpdate({
            type: 'reservationUpdate',
            status: 'confirmed',
            roomId: room_number
        });

        res.status(201).json(resultReserva.rows[0]);
    } catch (err) {
        res.status(400).send('Erro ao confirmar reserva');
    }
});

module.exports = router;