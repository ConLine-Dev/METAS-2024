const { executeQuerySQL } = require('../connect/headCargo');


const WebSocket = {
    data: [],
    lastId: 0,
    lastIdInvoice: 0,
    Init: async function(io){
        const novo_result = await WebSocket.toListen();
        this.lastId = novo_result.IdLogistica_House;

        // Escuta o pagamento de uma fatura
        const novo_result_Invoice = await WebSocket.toListenInvoice();
        this.lastIdInvoice = novo_result_Invoice.IdFatura_Financeira_Baixa;

        // Configuração do Socket.IO
        io.on('connection', (socket) => {
            console.log('Usuário conectado');
        
            // Disconecta o usuário
            socket.on('disconnect', () => {
            console.log('Usuário desconectado');
            });


            setInterval(async () => {
                const result = await WebSocket.toListen();
                const resultInvoice = await WebSocket.toListenInvoice();

                const id = result.IdLogistica_House;
                const idInvoice = resultInvoice.IdFatura_Financeira_Baixa;

                if(id != WebSocket.lastId){
                    WebSocket.lastId = id;
                    io.emit('NewProcess', result);
                    console.log(WebSocket.lastId)
                }

                if(idInvoice != WebSocket.lastIdInvoice){
                    WebSocket.lastIdInvoice = idInvoice;
                    io.emit('NewInvoice', resultInvoice);
                    console.log(WebSocket.lastIdInvoice)
                }
            }, 2000);
        });



    },
    toListen: async function(){
        const result = await executeQuerySQL(`SET LANGUAGE Portuguese SELECT TOP 1 * FROM vis_Metas_Processo_Nova ORDER BY IdLogistica_House DESC`);
        return result[0]
    },
    toListenInvoice: async function(){
        const result = await executeQuerySQL(`SET LANGUAGE Portuguese SELECT TOP 1 IdFatura_Financeira_Baixa FROM mov_Fatura_Financeira_Baixa ORDER BY IdFatura_Financeira_Baixa DESC`);
        return result[0]
    }
}




module.exports = WebSocket;