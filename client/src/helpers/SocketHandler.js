import io from 'socket.io-client';

let opponentColor = 0x77aadd;

let playerPath = 0xaa2200;
let opponentPath = 0x005492;

export default class SocketHandler{
    constructor(scene) {

        this.scene = scene;
        
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
            let handToUpdate = socketId === scene.socket.id ? scene.GameHandler.playerHand : scene.GameHandler.opponentHand;
            let handToUpdateObjects = socketId === scene.socket.id ? scene.GameHandler.playerHandObjects : scene.GameHandler.opponentHandObjects;

            let xStart = socketId === scene.socket.id ? 650 : 150; 
            let yStart = socketId === scene.socket.id ? 800 - 15 : 550; 
        
            // Find the number of cards already in the hand
            let numExistingCards = handToUpdate.length;
        
            for (let i = 0; i < cards.length; i++) {
                let cardData = cards[i];
        
                let emptySpaceIndex = handToUpdate.findIndex(card => !card);
                console.log('player hand: ', scene.GameHandler.playerHand);
                console.log('opponent hand: ', scene.GameHandler.opponentHand);
                console.log('empty space index: ', emptySpaceIndex);
        
                // If there's an empty space, place the new card in that space
                if (emptySpaceIndex !== -1) {
                    let x = xStart + (socketId === scene.socket.id ? emptySpaceIndex * 150 : emptySpaceIndex * 75);  
                    
                    handToUpdate[emptySpaceIndex] = cardData;
                    if(socketId !== scene.socket.id) cardData = "cardBack";

                    //let newcard = handToUpdateObjects.push(scene.DeckHandler.dealCard(x, yStart, cardData, socketId === scene.socket.id ? "playerCard" : "opponentCard"));
                    scene.DeckHandler.dealCard(x, yStart, cardData, socketId === scene.socket.id ? "playerCard" : "opponentCard");
                } else {
                    // If there's no empty space, add the new card at the end of the hand
                    let x = xStart + (socketId === scene.socket.id ? numExistingCards * 150 : numExistingCards * 75); 

                    handToUpdate.push(cardData);
                    if(socketId !== scene.socket.id) cardData = "cardBack";

                    //let newcard = handToUpdateObjects.push(scene.DeckHandler.dealCard(x, yStart, cardData, socketId === scene.socket.id ? "playerCard" : "opponentCard"));
                    scene.DeckHandler.dealCard(x, yStart, cardData, socketId === scene.socket.id ? "playerCard" : "opponentCard");
                    numExistingCards++; 
                }
            }
        });
        

        scene.socket.on('cardPlayed', (index, pairs, newPositionPlayer, newPositionOpponent,  cardName, socketId, x, y, playerMarkerX, playerMarkerY, opponentMarkerX, opponentMarkerY, opponentMoved, nextIndexPlayer, nextIndexOpponent) => {
            
            if (socketId !== scene.socket.id) {
                // if opponent moved
                let indexOfCard = scene.GameHandler.opponentHand.indexOf(cardName);
                scene.GameHandler.opponentHand[indexOfCard] = null;
                //scene.GameHandler.opponentHandObjects.shift().destroy();
                // TO DO - debug and show the placing of a card of the opponent
                // maybe use cardsleft variable or sth

                // SHOW ROTATION
                // SHOW PATH

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
                }

            }else{
                let indexOfCard = scene.GameHandler.playerHand.indexOf(cardName);
                scene.GameHandler.playerHand[indexOfCard] = null;
                //scene.GameHandler.playerHandObjects.shift().destroy();
            } 
        })

        scene.socket.on('markerMoved', (marker, socketId) => {
            let x = marker.x;
            let y = marker.y;
            // console.log('marker x: ', x);
            // console.log('marker y: ', y);

            if (socketId !== scene.socket.id) {
                scene.markerOpponent = scene.add.circle(x, y, 10, opponentColor).setDepth(1);
                scene.markerOpponent.setStrokeStyle(2, 0x000000);
                scene.markerOpponent.type = 'marker';
                scene.markerOpponent.setDepth(3);
            }

            //if both markers are placed emit markersPlaced
            if(scene.markerPlayer && scene.markerOpponent){
                if(scene.markerPlayer.x !== 200 && scene.markerPlayer.y !== 250 && scene.markerOpponent.x !== 200 && scene.markerOpponent.y !== 250){
                    scene.socket.emit('markersPlaced', scene.socket.id);
                }
            }
        })

        scene.socket.on('pathPlaced', (isPlayer, x, y, start, end, socketId) => {
            
            let key = start + "_" + end;
            if (!(scene.textures.exists(key))) {
                key = end + "_" + start;  
            }
            console.log(key);

            let path = scene.add.image(x, y, key);
            path.setScale(0.65, 0.65);

            // player moved
            if (socketId === scene.socket.id){
                if(isPlayer){
                    path.setTint(playerPath);
                }else{
                    path.setTint(opponentPath);
                }
                
            } else { // opponent moved
                path.setDepth(2);
                if(isPlayer){
                    path.setTint(opponentPath);
                }else{
                    path.setTint(playerPath);
                }
            }
        })

        scene.socket.on('gameOver', (isPlayer, socketId) => {
            
            if(socketId === scene.socket.id){
                if(isPlayer){
                    this.scene.scene.start('GameOver', { text: "You've lost :(" });
                }else{
                    this.scene.scene.start('GameOver', { text: "You've won :)" });
                }
            }else{
                if(isPlayer){
                    this.scene.scene.start('GameOver', { text: "You've won :)" });
                }else{
                    this.scene.scene.start('GameOver', { text: "You've lost :(" });
                }
            }
        })
    }
}