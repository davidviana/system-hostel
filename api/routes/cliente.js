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
    const { nome, document, email, bornDate, telefone, sexo, senha } = req.body;

    if (!nome || !document || !email || !telefone || !senha || !sexo || !bornDate) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const [day, month, year] = bornDate.split('/');
    const formattedBornDate = new Date(`${year}-${month}-${day}`);

    if (isNaN(formattedBornDate)) {
        return res.status(400).send('Data de nascimento inválida.');
    }

    const today = new Date();
    const age = today.getFullYear() - formattedBornDate.getFullYear();

    const hashedDocument = await encryptUsers(document);
    const hashedSenha = await encryptUsers(senha);

    try {
        const result = await pool.query(
            'INSERT INTO cliente (nome, cpf, email, telefone, senha_acesso, sexo, data_nascimento, idade) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [nome, hashedDocument, email, telefone, hashedSenha, sexo, formattedBornDate, age]
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
