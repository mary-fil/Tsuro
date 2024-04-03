import io from 'socket.io-client';

let opponentColor = 0x77aadd;


export default class SocketHandler{
    constructor(scene) {
        
        scene.socket = io('http://localhost:3000');

        scene.socket.on('connect', () => {
            console.log('Connected!');
            scene.socket.emit('dealDeck', scene.socket.id);
        })

        scene.socket.on('firstTurn', (socketId) => {
            if(socketId === scene.socket.id){
                scene.playerTurnText.setVisible(true); 
                scene.opponentTurnText.setVisible(false);
            } else{
                scene.playerTurnText.setVisible(false); 
                scene.opponentTurnText.setVisible(true);
            }
            scene.GameHandler.changeTurn();
        })

        scene.socket.on('changeGameState', (gameState) => {
            scene.GameHandler.changeGameState(gameState);
            if(gameState === "Showing markers"){
                scene.placeMarkersButton.setInteractive();
            }
            else if(gameState === "Initializing"){
                // showing a card on the stack
                scene.DeckHandler.dealCard(1400 - 25, 300 - 25, "cardBack", "playerCard");

                scene.dealCardsButton.setVisible(true);
                scene.dealCards.setVisible(true);

                scene.dealCardsButton.setInteractive();
            }
        })

        scene.socket.on('changeTurn', () => {
            scene.GameHandler.changeTurn();
            if(scene.GameHandler.isMyTurn) {
                scene.playerTurnText.setVisible(true); 
                scene.opponentTurnText.setVisible(false);
            } else {
                scene.playerTurnText.setVisible(false); 
                scene.opponentTurnText.setVisible(true);
            }
        })

        scene.socket.on('dealCards', (socketId, cards) => {
            if (socketId === scene.socket.id) {
                for(let i in cards){
                    let card = scene.GameHandler.playerHand.push(scene.DeckHandler.dealCard(650 + (i * 150), 800-15, cards[i], "playerCard"));
                }
            } else {
                for(let i in cards){
                    let card = scene.GameHandler.opponentHand.push(scene.DeckHandler.dealCard(150 + (i * 75), 550, "cardBack", "opponentCard"));
                }
            }
        })

        scene.socket.on('cardPlayed', (index, pairs, newPositionPlayer, newPositionOpponent,  cardName, socketId, x, y, playerMarkerX, playerMarkerY, opponentMarkerX, opponentMarkerY, opponentMoved, nextIndexPlayer, nextIndexOpponent) => {

            if (socketId !== scene.socket.id) {
                // if opponent moved
                scene.GameHandler.opponentHand.shift().destroy();

                //scene.GameHandler.Board[index].push(pairs);
                scene.GameHandler.Board[index] = pairs;

                let card = scene.add.image(x, y, "tile" + cardName);
                card.setScale(0.65, 0.65);
                card.setDepth(0);

                // move opponent marker and update all info about the opponent marker
                scene.markerOpponent.x = playerMarkerX;
                scene.markerOpponent.y = playerMarkerY;

                scene.GameHandler.opponentMarkerX = playerMarkerX;
                scene.GameHandler.opponentMarkerY = playerMarkerY;

                scene.GameHandler.opponentMarkerPosition = newPositionPlayer;
                scene.GameHandler.opponentNextIndex = nextIndexPlayer

                // update your marker if it was moved
                if(opponentMoved) {
                    scene.markerPlayer.x = opponentMarkerX;
                    scene.markerPlayer.y = opponentMarkerY;

                    scene.GameHandler.playerMarkerPosition = newPositionOpponent;
                    scene.GameHandler.playerNextIndex = nextIndexOpponent;
    
                    // scene.GameHandler.playerMarkerX = opponentMarkerX;
                    // scene.GameHandler.playerMarkerY = opponentMarkerY;
                }

            } else{
                // if you moved - is it necessary?
                // scene.GameHandler.playerMarkerX = playerMarkerX;
                // scene.GameHandler.playerMarkerY = playerMarkerY;
            }

            // after card player
            // take a card interaction should be available
        })

        scene.socket.on('markerMoved', (marker, socketId) => {
            let x = marker.x;
            let y = marker.y;
            // console.log('marker x: ', x);
            // console.log('marker y: ', y);

            if (socketId === scene.socket.id) {
                // scene.GameHandler.playerMarkerX = x;
                // scene.GameHandler.playerMarkerY = y;
            } else{
                scene.markerOpponent = scene.add.circle(x, y, 10, opponentColor).setDepth(1);
                scene.markerOpponent.setStrokeStyle(2, 0x000000);
                scene.markerOpponent.type = 'marker';

                // scene.GameHandler.opponentMarkerX = x;
                // scene.GameHandler.opponentMarkerY = y;
            }

            //if both markers are placed emit markersPlaced
            if(scene.markerPlayer && scene.markerOpponent){
                if(scene.markerPlayer.x !== 200 && scene.markerPlayer.y !== 250 && scene.markerOpponent.x !== 200 && scene.markerOpponent.y !== 250){
                    scene.socket.emit('markersPlaced', scene.socket.id);
                }
            }
        })
    }
}