const WebSocket = require('ws');

// Configuração do WebSocket
const wss = new WebSocket.Server({ noServer: true });
let clients = [];

// Função para enviar uma mensagem para todos os clientes conectados
const broadcastUpdate = (message) => {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

// Gerenciar conexões WebSocket
wss.on('connection', (ws) => {
    console.log('Novo cliente WebSocket conectado');
    clients.push(ws); // Adiciona o cliente à lista de clientes conectados

    // Lidar com mensagens recebidas do cliente
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Mensagem recebida:', data);
    });

    // Lidar com o fechamento da conexão WebSocket
    ws.on('close', () => {
        console.log('Conexão WebSocket fechada');
        // Remove o cliente da lista quando ele se desconectar
        clients = clients.filter(client => client !== ws);
    });
});

// Função para ser usada em outros arquivos
const handleUpgrade = (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
};

// Exporta o WebSocket e a função broadcastUpdate
module.exports = {
    handleUpgrade,
    broadcastUpdate
};
