import io from 'socket.io-client';

export default class SocketHandler{
    constructor(scene) {
        
        scene.socket = io('http://localhost:3000');

        scene.socket.on('connect', () => {
            console.log('Connected!');
            scene.socket.emit('dealDeck', scene.socket.id);
        })

        scene.socket.on('firstTurn', () => {
            scene.GameHandler.changeTurn();
        })

        scene.socket.on('changeGameState', (gameState) => {
            scene.GameHandler.changeGameState(gameState);
            if(gameState === "Showing markers"){
                scene.placeMarkers.setInteractive();
                scene.placeMarkers.setColor("#00ffff");
            }
            else if(gameState === "Initializing"){
                // showing a card on the stack
                scene.DeckHandler.dealCard(1400 - 25, 300 - 25, "cardBack", "playerCard");
                //scene.DeckHandler.dealCard(1000, 135, "cardBack", "opponentCard");

                scene.dealCards.setInteractive();
                scene.dealCards.setColor("#00ffff");
            }
        })

        scene.socket.on('changeTurn', () => {
            scene.GameHandler.changeTurn();
        })

        scene.socket.on('dealCards', (socketId, cards) => {
            if (socketId === scene.socket.id) {
                for(let i in cards){
                    let card = scene.GameHandler.playerHand.push(scene.DeckHandler.dealCard(650 + (i * 150), 800, cards[i], "playerCard"));
                }
            } else {
                for(let i in cards){
                    let card = scene.GameHandler.opponentHand.push(scene.DeckHandler.dealCard(175 + (i * 75), 550, "cardBack", "opponentCard"));
                }
            }
        })

        scene.socket.on('cardPlayed', (cardName, socketId, index, x, y) => {
            if (socketId !== scene.socket.id) {
                scene.GameHandler.opponentHand.shift().destroy();
                let card = scene.add.image(x, y, "tile" + cardName);
                card.setScale(0.65, 0.65);
            }
        })

        scene.socket.on('markerMoved', (marker, socketId) => {
            let x = marker.x;
            let y = marker.y;
            if (socketId === scene.socket.id) {
                scene.GameHandler.playerMarkerX = x;
                scene.GameHandler.playerMarkerY = y;
            } else{
                scene.marker = scene.add.circle(x, y, 10, 0xff0000);
                scene.marker.type = 'marker';

                scene.GameHandler.opponentMarkerX = x;
                scene.GameHandler.opponentMarkerY = y;
            }

            //if both markers are placed emit markersPlaced
            if(scene.GameHandler.playerMarkerX !== 200 && scene.GameHandler.playerMarkerY !== 250 && scene.GameHandler.opponentMarkerX !== 200 && scene.GameHandler.opponentMarkerY !== 250){
                scene.socket.emit('markersPlaced', scene.socket.id);
            }
        })
    }
}