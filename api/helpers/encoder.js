const crypto = require('crypto');

const encryptUsers = async (string) => {
    try {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHmac('sha256', salt).update(string).digest('hex'); 
        return { hash, salt };
    } catch (error) {
        console.error('Erro ao criptografar a string:', error);
    }
};

module.exports = encryptUsers;
