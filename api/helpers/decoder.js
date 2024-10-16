const crypto = require('crypto');

const descryptUsers = async (senha, salt) => {
    try {
        const hash = crypto.createHmac('sha256', salt).update(senha).digest('hex'); 
        return hash;
    } catch (error) {
        console.error('Erro ao criptografar a string:', error);
    }
};

module.exports = descryptUsers;
