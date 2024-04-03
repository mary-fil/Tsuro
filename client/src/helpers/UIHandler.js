//handling all user interface stuff
//dependency injection

import ZoneHandler from "./ZoneHandler";

let opponentColor = 0x668899;
let playerColor = 0xaa2200;

let opponentZoneColor = 0x77aadd;
let playerZoneColor = 0xeecc66;

export class UIHandler {

    constructor (scene)
    {
        this.zoneHandler = new ZoneHandler(scene);

        this.buildZones = () => {
            scene.dropZone = this.zoneHandler.renderZone(550, 100);
            this.zoneHandler.renderOutline(scene.dropZone);
        }

        this.buildPlayerAreas = () => {

            //player
            scene.playerHandArea = scene.add.rectangle(800, 800-15, 450, 150);
            scene.playerHandArea.setFillStyle(playerZoneColor);

            //opponent
            scene.opponentHandArea = scene.add.rectangle(250 - 25, 550, 250, 100);
            scene.opponentHandArea.setFillStyle(opponentZoneColor);

            //deck for all players
            scene.playerDeckArea = scene.add.rectangle(1400 - 25, 300 - 25, 150, 150);
            scene.playerDeckArea.setFillStyle(0x668899);

            //place marker zone
            scene.placeMarkerArea = scene.add.rectangle(250 - 25, 300 - 25, 150, 150);
            scene.placeMarkerArea.setFillStyle(0x668899);

            //game state area
            scene.gameStateArea = scene.add.rectangle(250 - 25, 100, 350, 75);
            scene.gameStateArea.setFillStyle(0x668899);
            
        }

        this.buildGameText = () => {

            // player turn
            scene.playerTurnText = scene.add.text(scene.gameStateArea.x, scene.gameStateArea.y, "YOUR TURN", { fontFamily: 'Verdana', fontSize: 30, color: '#eecc66' });
            scene.playerTurnText.setOrigin(0.5); 
            scene.playerTurnText.setVisible(false); 

            // opponent turn
            scene.opponentTurnText = scene.add.text(scene.gameStateArea.x, scene.gameStateArea.y, "OPPONENT'S TURN", { fontFamily: 'Verdana', fontSize: 30, color: '#ffffff' });
            scene.opponentTurnText.setOrigin(0.5); 
            scene.opponentTurnText.setVisible(false);

            // opponent's hand
            let opponent = scene.add.rectangle(250 - 25, 500, 125, 25, opponentColor);
            let textOpponent = scene.add.text(opponent.x, opponent.y, "OPPONENT", { fontFamily: 'Verdana', fontSize: 18, color: '#ffffff' });
            textOpponent.setOrigin(0.5); 

            // player's hand
            let player = scene.add.rectangle(800, 750 - 25 - 15, 125, 25, playerColor);
            let textPlayer = scene.add.text(player.x, player.y, "MY HAND", { fontFamily: 'Verdana', fontSize: 18, color: '#ffffff' });
            textPlayer.setOrigin(0.5); 

            // deal cards button
            scene.dealCardsButton = scene.add.rectangle(1400 - 25, 400, 150, 50, 0x77aadd);
            scene.dealCards = scene.add.text(scene.dealCardsButton.x, scene.dealCardsButton.y, "DEAL CARDS", {fontFamily: 'Verdana', fontSize: 18});
            scene.dealCards.setOrigin(0.5); 

            scene.dealCardsButton.setVisible(false);
            scene.dealCards.setVisible(false);

            // take a card button
            scene.takeCardButton = scene.add.rectangle(1400 - 25, 400, 150, 50, 0x77aadd);
            scene.takeCard = scene.add.text(scene.takeCardButton.x, scene.takeCardButton.y, "TAKE A CARD", {fontFamily: 'Verdana', fontSize: 18});
            scene.takeCard.setOrigin(0.5); 

            scene.takeCardButton.setVisible(false);
            scene.takeCard.setVisible(false);

            // place markers button
            scene.placeMarkersButton = scene.add.rectangle(250 - 25, 250, 100, 50, 0x77aadd);
            scene.placeMarkers = scene.add.text(scene.placeMarkersButton.x, scene.placeMarkersButton.y, "PLACE\nMARKER", {fontFamily: 'Verdana', fontSize: 18, align: 'center'});
            scene.placeMarkers.setOrigin(0.5); 
        }

        this.buildUI = () => {
            this.buildZones();
            this.buildPlayerAreas();
            this.buildGameText();
        }


    }
}