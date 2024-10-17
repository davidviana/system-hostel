const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

router.post('/', (req, res) => {
    exec('shutdown -h now', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao desligar o sistema: ${error}`);
            return res.status(500).send('Erro ao desligar o sistema.');
        }
        console.log('Sistema desligando:', stdout);
        res.send('Sistema será desligado.');
    });
});

module.exports = router;