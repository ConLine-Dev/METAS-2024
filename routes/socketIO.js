
const socket = {
    Init: function(io){
        // Configuração do Socket.IO
        io.on('connection', (socket) => {
            console.log('Usuário conectado');
        
            // Recebe mensagens do cliente e transmite para todos os clientes
            socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
            });
        
            // Disconecta o usuário
            socket.on('disconnect', () => {
            console.log('Usuário desconectado');
            });
        });
    },
}




module.exports = socket;