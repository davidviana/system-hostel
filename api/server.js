const express = require('express');
const cors = require('cors');

const clientesRoutes = require('./routes/cliente');
const funcionarioRoutes = require('./routes/funcionario');
const quartosRoutes = require('./routes/quarto');
const reservasRoutes = require('./routes/reserva');
const pagamentosRoutes = require('./routes/pagamento');
const sistemaRoutes = require('./routes/sistema')

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.use('/api/cliente', clientesRoutes);
app.use('/api/funcionario', funcionarioRoutes);
app.use('/api/quarto', quartosRoutes);
app.use('/api/reserva', reservasRoutes);
app.use('/api/pagamento', pagamentosRoutes);
app.use('/api/shutdown', sistemaRoutes)

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
