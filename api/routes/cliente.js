const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const encryptUsers = require('../helpers/encoder');

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
    const { nome, document, email, telefone, senha } = req.body;

    // Basic validation
    if (!nome || !document || !email || !telefone || !senha) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const hashedDocument = await encryptUsers(document);
    const hashedSenha = await encryptUsers(senha);

    try {
        const result = await pool.query(
            'INSERT INTO cliente (nome, cpf, email, telefone, senha_acesso) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, hashedDocument, email, telefone, hashedSenha]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar cliente:', err);
        res.status(400).send('Erro ao adicionar cliente');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM cliente WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Cliente não encontrado');
        }
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover cliente:', err);
        res.status(500).send('Erro ao remover cliente');
    }
});

module.exports = router;
