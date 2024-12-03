const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });
let clients = [];

const broadcastUpdate = (message) => {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
            console.log(clients)
        }
    });
};

// Gerenciar conexões WebSocket
wss.on('connection', (ws) => {
    console.log('Novo cliente WebSocket conectado');
    clients.push(ws);

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Mensagem recebida:', data);
    });

    ws.on('close', () => {
        console.log('Conexão WebSocket fechada');
        clients = clients.filter(client => client !== ws);
    });
});

const handleUpgrade = (request, socket, head) => {
    console.log('handleUpgrade está ativo')
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
};

module.exports = {
    handleUpgrade,
    broadcastUpdate
};
