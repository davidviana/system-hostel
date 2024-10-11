const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET: Listar todos os clientes
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cliente');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).send('Erro ao buscar clientes');
    }
});

// POST: Adicionar um novo cliente
router.post('/', async (req, res) => {
    const { nome, cpf, email, telefone, senha_acesso } = req.body;
    try {
        const result = await pool.query('INSERT INTO cliente (nome, cpf, email, telefone, senha_acesso) VALUES ($1, $2, $3, $4, $5) RETURNING *', [nome, cpf, email, telefone, senha_acesso]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar cliente:', err);
        res.status(400).send('Erro ao adicionar cliente');
    }
});

// DELETE: Remover um cliente
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM cliente WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover cliente:', err);
        res.status(500).send('Erro ao remover cliente');
    }
});

module.exports = router;
