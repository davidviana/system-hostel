const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const encryptUsers = require('../helpers/encoder');
const descryptUsers = require('../helpers/decoder')

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
        const result = await pool.query('SELECT nome, cargo FROM funcionario WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Cliente não encontrado');
        }

        res.status(200).send({ nome: result.rows[0].nome, cargo: result.rows[0].cargo });
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).send('Erro ao buscar cliente');
    }
});

// POST: Login
router.post('/login', async (req, res) => {
    const { document, senha } = req.body;

    try {
        const result = await pool.query('SELECT * FROM funcionario WHERE cpf = $1', [document]);
        if (result.rows.length === 0) {
            return res.status(401).send('Credenciais inválidas');
        }

        const colab = result.rows[0];
        const hashedSenha = await descryptUsers(senha, colab.salt_senha);
        if (hashedSenha !== colab.senha_acesso) {
            return res.status(401).send('Credenciais inválidas');
        }
        res.json({ message: 'Login bem-sucedido', colab });
    } catch (err) {
        console.error('Erro ao realizar login:', err);
        res.status(500).send('Erro ao realizar login');
    }
});

// POST: Adicionar um novo funcionario
router.post('/', async (req, res) => {
    const { nome, document, email, bornDate, telefone, role, sexo, senha } = req.body;

    // Validação de campos obrigatórios
    if (!nome || !document || !email || !telefone || !senha || !sexo || !bornDate || !role) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const [day, month, year] = bornDate.split('/');
    const formattedBornDate = new Date(`${year}-${month}-${day}`);

    if (isNaN(formattedBornDate)) {
        return res.status(400).send('Data de nascimento inválida.');
    }

    const today = new Date();
    const age = today.getFullYear() - formattedBornDate.getFullYear();

    try {
        const { hash: hashedSenha, salt: saltSenha } = await encryptUsers(senha);
        const result = await pool.query('INSERT INTO funcionario (nome, cpf, email, telefone, cargo, senha_acesso, salt_senha, sexo, data_nascimento, idade) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [nome, document, email, telefone, role, hashedSenha, saltSenha, sexo, formattedBornDate, age]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar funcionário:', err);
        res.status(400).send('Erro ao adicionar funcionário');
    }
});

// POST: Pegar só um funcionario
router.post('/check', async (req, res) => {
    const { document } = req.body;

    try {
        const result = await pool.query('SELECT * FROM funcionario WHERE cpf = $1', [document]);
        if (result.rowCount === 0) {
            return res.status(404).send('Cliente não encontrado');
        }

        res.status(200).send({ id: result.rows[0].id });
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).send('Erro ao buscar cliente');
    }
});

// POST: Atualizar as informações do cadastro
router.post('/update', async (req, res) => {
    const { id, nome, email, telefone } = req.body;
    if (!nome && !email && !telefone && !id) {
        return res.status(400).json({ message: 'Pelo menos um campo deve ser fornecido para atualização.' });
    }

    try {
        const updates = [];
        const params = [];

        if (nome) {
            updates.push(`nome = $${updates.length + 1}`);
            params.push(nome);
        }
        if (email) {
            updates.push(`email = $${updates.length + 1}`);
            params.push(email);
        }
        if (telefone) {
            updates.push(`telefone = $${updates.length + 1}`);
            params.push(telefone);
        }

        const query = `UPDATE funcionario SET ${updates.join(', ')} WHERE id = $${updates.length + 1} RETURNING *`;
        params.push(id);

        const result = await pool.query(query, params);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        return res.status(200).json({ message: 'Cadastro atualizado com sucesso.', data: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar o cadastro:', error);
        return res.status(500).json({ message: 'Erro interno ao atualizar o cadastro.' });
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
