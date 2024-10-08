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


app.get('/api/data', async (req, res) => {
try {
    const result = await pool.query('SELECT * FROM cliente'); // Query no banco
    res.json(result.rows); // Retorna os dados da tabela em formato JSON
} catch (err) {
    console.error('Erro ao buscar dados:', err);
    res.status(500).send('Erro ao buscar dados');
}
});

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
