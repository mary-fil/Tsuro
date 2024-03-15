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

                // scene.marker1 = scene.add.circle(200, 250, 10, 0x000000);
                // scene.marker2 = scene.add.circle(250, 250, 10, 0xff0000);
                // scene.marker1.name = 'marker1';
                // scene.marker2.name = 'marker2';
                // scene.marker1.type = 'marker';
                // scene.marker2.type = 'marker';
                // scene.marker1.isPlaced = false;
                // scene.marker2.isPlaced = false;
                // scene.marker1.setInteractive({ draggable: true });
                // scene.marker2.setInteractive({ draggable: true });
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
                    let card = scene.GameHandler.opponentHand.push(scene.DeckHandler.dealCard(175 + (i * 75), 550, cards[i], "opponentCard"));
                }
            }
        })

        scene.socket.on('cardPlayed', (cardName, socketId) => {
            if (socketId !== scene.socket.id) {
                scene.GameHandler.opponentHand.shift().destroy();
                scene.DeckHandler.dealCard((scene.dropZone.x - 350) + (scene.dropZone.data.values.cards * 50), scene.dropZone.y, cardName, "opponentCard");
            }
            scene.dropZone.data.values.cards++;
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