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
            const shadowOffset = 5; // Adjust this value to control the size of the shadow
            const shadowAlpha = 0.2;
            const mode = Phaser.BlendModes.NORMAL;
        
            // Player hand area
            scene.add.rectangle(800 - shadowOffset, 800 - 15 + shadowOffset, 450, 150).setFillStyle(0x000000).setAlpha(shadowAlpha).setBlendMode(mode);
            scene.playerHandArea = scene.add.rectangle(800, 800 - 15, 450, 150);
            scene.playerHandArea.setFillStyle(playerZoneColor);
        
            // Opponent hand area
            scene.add.rectangle(250 - 25 - shadowOffset, 800 - 15 + shadowOffset, 250, 100).setFillStyle(0x000000).setAlpha(shadowAlpha).setBlendMode(mode);
            scene.opponentHandArea = scene.add.rectangle(250 - 25, 800 - 15, 250, 100);
            scene.opponentHandArea.setFillStyle(opponentZoneColor);
        
            // Player deck area
            scene.add.rectangle(1400 - 25 - shadowOffset, 300 - 25 + shadowOffset, 150, 150).setFillStyle(0x000000).setAlpha(shadowAlpha).setBlendMode(mode);
            scene.playerDeckArea = scene.add.rectangle(1400 - 25, 300 - 25, 150, 150);
            scene.playerDeckArea.setFillStyle(0x668899);
        
            // Place marker zone
            scene.placeMarkerAreaShadow = scene.add.rectangle(250 - 25 - shadowOffset, 300 - 25 + shadowOffset, 150, 150).setFillStyle(0x000000).setAlpha(shadowAlpha).setBlendMode(mode);
            scene.placeMarkerArea = scene.add.rectangle(250 - 25, 300 - 25, 150, 150);
            scene.placeMarkerArea.setFillStyle(0x668899);
        
            // Game state area
            scene.add.rectangle(250 - 25 - shadowOffset, 100 + shadowOffset, 250, 75).setFillStyle(0x000000).setAlpha(shadowAlpha).setBlendMode(mode);
            scene.gameStateArea = scene.add.rectangle(250 - 25, 100, 250, 75);
            scene.gameStateArea.setFillStyle(0x668899);
        }      

        this.buildGameText = () => {
 
            const blendMode = Phaser.BlendModes.NORMAL;

            // turn text
            let turn = scene.add.rectangle(250 - 25, scene.gameStateArea.y - 35, 125, 25, opponentZoneColor);
            let textTurn = scene.add.text(turn.x, turn.y, "TURN", { fontFamily: 'Verdana', fontSize: 18, color: '#ffffff' });
            textTurn.setOrigin(0.5); 

            // player turn
            scene.playerTurnText = scene.add.text(scene.gameStateArea.x, scene.gameStateArea.y, "YOUR TURN", { fontFamily: 'Verdana', fontSize: 22, color: '#eecc66' });
            scene.playerTurnText.setOrigin(0.5); 
            scene.playerTurnText.setVisible(false); 

            // opponent turn
            scene.opponentTurnText = scene.add.text(scene.gameStateArea.x, scene.gameStateArea.y, "OPPONENT'S TURN", { fontFamily: 'Verdana', fontSize: 22, color: '#ffffff' });
            scene.opponentTurnText.setOrigin(0.5); 
            scene.opponentTurnText.setVisible(false);

            // opponent's hand
            let opponent = scene.add.rectangle(250 - 25, 800-15 - 50, 125, 25, opponentColor);
            let textOpponent = scene.add.text(opponent.x, opponent.y, "OPPONENT", { fontFamily: 'Verdana', fontSize: 18, color: '#ffffff' });
            textOpponent.setOrigin(0.5); 

            // player's hand
            let player = scene.add.rectangle(800, 750 - 25 - 15, 125, 25, playerColor);
            let textPlayer = scene.add.text(player.x, player.y, "MY HAND", { fontFamily: 'Verdana', fontSize: 18, color: '#ffffff' });
            textPlayer.setOrigin(0.5); 

            // deal cards button
            scene.dealCardsButton = scene.add.rectangle(1400 - 25, 400, 150, 50, 0x77aadd).setDepth(1);
            scene.dealCardsButtonShadow = scene.add.rectangle(1400 - 25 - 5, 400 + 5, 150, 50, 0x000000).setAlpha(0.2).setBlendMode(blendMode).setDepth(0);
            scene.dealCards = scene.add.text(scene.dealCardsButton.x, scene.dealCardsButton.y, "DEAL CARDS", {fontFamily: 'Verdana', fontSize: 18}).setDepth(1);
            scene.dealCards.setOrigin(0.5); 

            scene.dealCardsButton.setVisible(false);
            scene.dealCards.setVisible(false);
            scene.dealCardsButtonShadow.setVisible(false);

            // take a card button
            scene.takeCardButton = scene.add.rectangle(1400 - 25, 400, 150, 50, 0x77aadd).setDepth(1);
            scene.takeCardButtonShadow = scene.add.rectangle(1400 - 25 - 5, 400 + 5, 150, 50, 0x000000).setAlpha(0.2).setBlendMode(blendMode).setDepth(0);
            scene.takeCard = scene.add.text(scene.takeCardButton.x, scene.takeCardButton.y, "TAKE A CARD", {fontFamily: 'Verdana', fontSize: 18}).setDepth(1);
            scene.takeCard.setOrigin(0.5); 

            scene.takeCardButton.setVisible(false);
            scene.takeCard.setVisible(false);
            scene.takeCardButtonShadow.setVisible(false);

            // place markers button
            scene.placeMarkersButton = scene.add.rectangle(250 - 25, 250, 100, 50, 0x77aadd).setDepth(1);
            scene.placeMarkersButtonShadow = scene.add.rectangle(250 - 25 - 5, 250 + 5, 100, 50, 0x000000).setAlpha(0.2).setBlendMode(blendMode).setDepth(0);
            scene.placeMarkers = scene.add.text(scene.placeMarkersButton.x, scene.placeMarkersButton.y, "PLACE\nMARKER", {fontFamily: 'Verdana', fontSize: 18, align: 'center'}).setDepth(1);
            scene.placeMarkers.setOrigin(0.5); 

            // rotate all cards button
            scene.rotateCardsButton = scene.add.rectangle(1100, 800-15, 100, 50, 0x77aadd).setDepth(1);
            scene.rotateCardsButtonShadow = scene.add.rectangle(1100 - 5, 800-15 + 5, 100, 50, 0x000000).setAlpha(0.2).setBlendMode(blendMode).setDepth(0);
            scene.rotateCards= scene.add.text(scene.rotateCardsButton.x, scene.rotateCardsButton.y, "ROTATE\nRIGHT", {fontFamily: 'Verdana', fontSize: 18, align: 'center'}).setDepth(1);
            scene.rotateCards.setOrigin(0.5); 

            scene.rotateCardsButton.disableInteractive();
        }

        this.buildUI = () => {
            this.buildZones();
            this.buildPlayerAreas();
            this.buildGameText();
        }


    }
}