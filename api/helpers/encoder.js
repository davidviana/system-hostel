const bcrypt = require('bcrypt');

const encryptUsers = async (string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(string, salt);
        return hash;
    } catch (error) {
        console.error('Erro ao criptografar a string:', error);
    }
};

module.exports = encryptUsers;
