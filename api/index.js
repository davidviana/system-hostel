const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: 'postgres',       
    host: 'localhost',         
    database: 'db-hotel-br-bom-retiro',     
    password: 'rawu1086',     
    port: 5432,                
});

// GET method
app.get('/api/cliente', async (req, res) => {
try {
    const result = await pool.query('SELECT * FROM cliente');
    res.json(result.rows); 
} catch (err) {
    console.error('Erro ao buscar dados:', err);
    res.status(500).send('Erro ao buscar dados');
}
});

// POST method
app.post('/api/cliente', async (req, res) => {
    const { nome, document, email, telefone, senha } = req.body;
    
    try {
        const result = await pool.query('INSERT INTO cliente(nome, cpf, email, telefone, senha_acesso) VALUES($1, $2, $3, $4, $5) RETURNING *', [nome, document,email,telefone, senha]);
        res.status(201).send(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});


app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
