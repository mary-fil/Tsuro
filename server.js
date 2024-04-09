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
        inHand: [],
        isPlayerA: false,
    }

    if(Object.keys(players).length < 2){
        players[socket.id].isPlayerA = true;
        io.emit('firstTurn', socket.id);
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
        io.emit('changeTurn');

        readyCheck++;
        if(readyCheck >= 2){
            gameState = "Ready";
            io.emit('changeGameState', 'Ready');
        }
    })

    socket.on('takeCard', function (socketId) {

        let dealtCard = deck.splice(0,1);

        players[socketId].inHand.push(dealtCard[0]);

        console.log(players);

        io.emit('dealCards', socketId, dealtCard);

        // if deck is empty inform all clients about no cards left and disable take cards button
        // if there are no cards left and last player moved then end game in a draw
        if(deck.length === 0){
            io.emit('deckEmpty');
        }

        io.emit('changeTurn');
    })

    socket.on('cardPlayed', function(index, angle, pairs, newPositionPlayer, newPositionOpponent,  cardName, socketId, x, y, playerMarkerX, playerMarkerY, opponentMarkerX, opponentMarkerY, opponentMoved, nextIndexPlayer, nextIndexOpponent) {
        // delete card from the hand
        let indexOfCard = players[socketId].inHand.indexOf(cardName);
        players[socketId].inHand.splice(indexOfCard,1);
        console.log(players);

        io.emit('cardPlayed', index, angle, pairs, newPositionPlayer, newPositionOpponent, cardName, socketId, x, y, playerMarkerX, playerMarkerY, opponentMarkerX, opponentMarkerY, opponentMoved, nextIndexPlayer,nextIndexOpponent);
        //io.emit('changeTurn');
    })

    socket.on('markerMoved', function(gameObject, socketId){
        io.emit('markerMoved', gameObject, socketId);
        io.emit('changeTurn');
    })

    socket.on('pathPlaced', function(isPlayer, x, y, start, end, socketId){
        io.emit('pathPlaced', isPlayer, x, y, start, end, socketId);
    })

    socket.on('gameOver', function(isDraw, isPlayer, socketId){
        io.emit('gameOver', isDraw, isPlayer, socketId);
    })

})

http.listen(3000, function () {
    console.log('Server started!');
})