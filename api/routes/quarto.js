const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET: Listar todos os quartos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Quarto');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar quartos:', err);
        res.status(500).send('Erro ao buscar quartos');
    }
});

// POST: Adicionar um novo quarto
router.post('/', async (req, res) => {
    const { numero, andar, tipo, preco, status } = req.body;
    try {
        const result = await pool.query('INSERT INTO Quarto (numero, andar, tipo, preco, status) VALUES ($1, $2, $3, $4, $5) RETURNING *', [numero, andar, tipo, preco, status]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar quarto:', err);
        res.status(400).send('Erro ao adicionar quarto');
    }
});

module.exports = router;