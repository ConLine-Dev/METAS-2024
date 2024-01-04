const { executeQuerySQL } = require('../connect/headCargo');


const WebSocket = {
    data: [],
    lastId: 0,
    Init: function(io){
        // Configuração do Socket.IO
        io.on('connection', (socket) => {
            console.log('Usuário conectado');
        
            // Disconecta o usuário
            socket.on('disconnect', () => {
            console.log('Usuário desconectado');
            });


            setInterval(async () => {
                const id = await WebSocket.toListen();
                if(id != WebSocket.lastId){
                    WebSocket.lastId = id;
                    io.emit('NewProcess', 'Atenção tem um novo processo');
                    console.log(WebSocket.lastId)
                }
            }, 5000);
        });



    },
    toListen: async function(){
        const result = await executeQuerySQL(`SET LANGUAGE Portuguese SELECT TOP 1 * FROM vis_Metas_Processo_Nova ORDER BY IdLogistica_House DESC`);
        return result[0].IdLogistica_House
    }
}




module.exports = WebSocket;