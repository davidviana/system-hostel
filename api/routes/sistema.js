const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
    const { role } = req.body;

    if (role === 'Gerente' || role === 'Tecníco de TI') {
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
