const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// Define o caminho do arquivo onde as conversas serão armazenadas
const caminhoDoArquivo = 'C:/Users/leo_n/Downloads/conversas.txt';

// Função para salvar conversa no arquivo
function salvarConversa(mensagem, resposta) {
    const linha = `Usuário: ${mensagem}\nBot: ${resposta}\n\n`;
    fs.appendFile(caminhoDoArquivo, linha, (err) => {
        if (err) throw err;
        console.log('A conversa foi salva!');
    });
}

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg) => {
        axios.post('http://localhost:5005/webhooks/rest/webhook', {
            sender: "user",
            message: msg
        }).then(response => {
            const reply = response.data.length > 0 ? response.data[0].text : "Desculpe, não consegui entender.";
            socket.emit('bot reply', reply);
            salvarConversa(msg, reply);
        }).catch(error => {
            console.error('Erro ao enviar mensagem:', error);
            socket.emit('bot reply', "Ocorreu um erro ao processar sua mensagem.");
    });
});

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
