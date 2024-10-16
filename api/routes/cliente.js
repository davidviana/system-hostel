const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const encryptUsers = require('../helpers/encoder');
const descryptUsers = require('../helpers/decoder')
const crypto = require('crypto');
const transporter = require('../helpers/sender')

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

    // Validação de campos obrigatórios
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

    try {
        const { hash: hashedSenha, salt: saltSenha } = await encryptUsers(senha);
        const result = await pool.query(
            'INSERT INTO cliente (nome, cpf, email, telefone, senha_acesso, sexo, data_nascimento, idade, salt_senha) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [nome, document, email, telefone, hashedSenha, sexo, formattedBornDate, age, saltSenha]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar cliente:', err);
        res.status(400).send('Erro ao adicionar cliente');
    }
});

// POST: Realizar o login do usuário
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    
    try {
        const result = await pool.query('SELECT * FROM cliente WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).send('Credenciais inválidas');
        }

        const user = result.rows[0];
        const hashedSenha = await descryptUsers(senha, user.salt_senha);
        if (hashedSenha !== user.senha_acesso) {
            return res.status(401).send('Credenciais inválidas');
        }
        res.json({ message: 'Login bem-sucedido', user });
    } catch (err) {
        console.error('Erro ao realizar login:', err);
        res.status(500).send('Erro ao realizar login');
    }
});

// POSTS: Reset de Senha
router.post('/reset', async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query('SELECT * FROM cliente WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).send('E-mail não encontrado');
        }

        const code = crypto.randomBytes(3).toString('hex');

        await transporter.sendMail({
            from: 'hostelbrbomretiro@gmail.com',
            to: email,
            subject: 'Código de Redefinição de Senha',
            text: `Seu código de redefinição de senha é: ${code}`,
        });

        res.status(200).send('Código enviado para o e-mail.');

    } catch (error) {
        console.log('Erro:', error);
        res.status(500).send('Erro ao enviar o e-mail');
    }
});
router.post('/confirm-code', async (req, res) => {
    const { email, code } = req.body;

    const isValidCode = true;

    if (!isValidCode) {
        return res.status(401).send('Código inválido');
    }

    res.status(200).send('Código confirmado, agora você pode redefinir sua senha.');
});

router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    const {hash: hashedNovaSenha, salt: saltNovaSenha} = await encryptUsers(newPassword)

    try {
        await pool.query('UPDATE cliente SET senha_acesso = $1, salt_senha = $2 WHERE email = $3', [hashedNovaSenha, saltNovaSenha, email]);

        res.status(200).send('Senha redefinida com sucesso.');
    } catch (error) {
        console.log('Erro:', error);
        res.status(500).send('Erro ao redefinir a senha');
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