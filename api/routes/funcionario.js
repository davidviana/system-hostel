const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET: Listar todos os funcionario
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM funcionario');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar funcionarios:', err);
        res.status(500).send('Erro ao buscar funcionarios');
    }
});

// GET: Pegar só um cliente
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT nome FROM funcionario WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Cliente não encontrado');
        }

        res.status(200).send({ nome: result.rows[0].nome });
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).send('Erro ao buscar cliente');
    }
});

router.post('/login', async (req, res) => {
    const { document, senha } = req.body; 

    try {
        const result = await pool.query('SELECT * FROM funcionario WHERE cpf = $1', [document]);
        if (result.rows.length === 0) {
            return res.status(401).send('Credenciais inválidas');
        }

        const user = result.rows[0];
        // const hashedSenha = await descryptUsers(senha, user.salt_senha);
        // if (hashedSenha !== user.senha_acesso) {
        //     return res.status(401).send('Credenciais inválidas');
        // }
        res.json({ message: 'Login bem-sucedido', user });
    } catch (err) {
        console.error('Erro ao realizar login:', err);
        res.status(500).send('Erro ao realizar login');
    }
});

// POST: Adicionar um novo funcionario
router.post('/', async (req, res) => {
    const { nome, cpf, email, telefone, cargo, senha_acesso } = req.body;
    try {
        const result = await pool.query('INSERT INTO funcionario (nome, cpf, email, telefone, cargo, senha_acesso) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [nome, cpf, email, telefone, cargo, senha_acesso]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar funcionário:', err);
        res.status(400).send('Erro ao adicionar funcionário');
    }
});

// DELETE: Remover um funcionario
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM funcionario WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover funcionario:', err);
        res.status(500).send('Erro ao remover funcionario');
    }
});



module.exports = router;
