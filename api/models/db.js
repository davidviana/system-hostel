const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db-hotel-br-bom-retiro',
    password: 'rawu1086',
    port: 5432,
});

module.exports = pool;
