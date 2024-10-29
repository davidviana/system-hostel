const express = require('express');
const router = express.Router();

router.use(express.json()); // Necessário para interpretar JSON no corpo da requisição

router.post('/', (req, res) => {
    const { role } = req.body; // Pega o role do corpo da requisição

    console.log(role);

    if (role === 'gerente' || role === 'tecnico') {
        setTimeout(() => {
            console.log('Encerrando API...');
            res.send({ message: 'Encerrando API...' });
            process.exit(0);
        }, 1000);
    } else {
        res.status(403).send({ message: 'Usuário não possui permissão para executar este comando' });
    }
});

module.exports = router;
