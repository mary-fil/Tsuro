const server = require('express')();
const http = require('http').createServer(server);
const cors = require('cors');
const shuffle = require('shuffle-array');
let players = {};
let readyCheck = 0;
let gameState = "";
let deck = [];

const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ["GET", "POST"]
    }
});

function initializeDeck(){
    if(deck.length === 0){
        for(let i = 1; i <= 35; i++){
            deck.push(i);
        }
        shuffle(deck);
    }
}

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    players[socket.id] = {
        inDeck: [],
        inHand: [],
        isPlayerA: false,
    }

    if(Object.keys(players).length < 2){
        players[socket.id].isPlayerA = true;
        io.emit('firstTurn');
    }

    socket.on('markersPlaced', function(socketId){
        io.emit('changeGameState', "Initializing");
    })

    socket.on('dealDeck', function (socketId){
        initializeDeck();

        console.log(players);
        console.log(deck);

        if(Object.keys(players).length < 2) return;
        io.emit('changeGameState', "Showing markers");
    })

    socket.on('dealCards', function (socketId) {
        let dealtCards = deck.splice(0,3)
        for(let i = 0; i < 3; i++){
            players[socketId].inHand.push(dealtCards[i]);
        }
        
        console.log(players);

        io.emit('dealCards', socketId, players[socketId].inHand);
        readyCheck++;
        if(readyCheck >= 2){
            gameState = "Ready";
            io.emit('changeGameState', 'Ready');
        }
    })

    socket.on('cardPlayed', function(cardName, socketId, index, x, y) {
        io.emit('cardPlayed', cardName, socketId, index, x, y);
        io.emit('changeTurn');
    })

    socket.on('markerMoved', function(gameObject, socketId){
        io.emit('markerMoved', gameObject, socketId);
        io.emit('changeTurn');
    })

})

http.listen(3000, function () {
    console.log('Server started!');
})