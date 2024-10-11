const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET: Listar todos os pagamentos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pagamento');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar pagamentos:', err);
        res.status(500).send('Erro ao buscar pagamentos');
    }
});

// POST: Adicionar um novo pagamento
router.post('/', async (req, res) => {
    const { valor_total, metodo_pagamento, data_pagamento, reserva_id } = req.body;
    try {
        const result = await pool.query('INSERT INTO pagamento (valor_total, metodo_pagamento, data_pagamento, reserva_id) VALUES ($1, $2, $3, $4) RETURNING *', [valor_total, metodo_pagamento, data_pagamento, reserva_id]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar pagamento:', err);
        res.status(400).send('Erro ao adicionar pagamento');
    }
});

// PUT: Cancelar um pagamento
router.put('/cancelar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('UPDATE Pagamento SET metodo_pagamento = $1 WHERE id = $2 RETURNING *', ['cancelado', id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Pagamento não encontrado');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao cancelar pagamento:', err);
        res.status(500).send('Erro ao cancelar pagamento');
    }
});

module.exports = router;