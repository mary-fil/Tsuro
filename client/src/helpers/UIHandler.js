//handling all user interface stuff
//dependency injection

import ZoneHandler from "./ZoneHandler";

export class UIHandler {

    constructor (scene)
    {
        this.zoneHandler = new ZoneHandler(scene);

        this.buildZones = () => {
            scene.dropZone = this.zoneHandler.renderZone(470, 500);
            this.zoneHandler.renderOutline(scene.dropZone);
        }

        this.buildPlayerAreas = () => {

            //player
            scene.playerHandArea = scene.add.rectangle(800, 800, 450, 150);
            scene.playerHandArea.setFillStyle(0x77aadd);

            //opponent
            scene.opponentHandArea = scene.add.rectangle(250, 550, 250, 100);
            scene.opponentHandArea.setFillStyle(0xeecc66);

            //deck for all players
            scene.playerDeckArea = scene.add.rectangle(1400 - 25, 300 - 25, 150, 150);
            scene.playerDeckArea.setFillStyle(0x668899);
            
        }

        this.buildGameText = () => {
            scene.dealCards = scene.add.text(1350 - 15, 200 - 50, "DEAL CARDS").setFontSize(14).setFontFamily("Trebuchet MS");
            scene.placeMarkers = scene.add.text(150, 200, "PLACE A MARKER").setFontSize(14).setFontFamily("Trebuchet MS");
        }

        this.buildUI = () => {
            //this.buildZones();
            this.buildPlayerAreas();
            this.buildGameText();
            
        }


    }
}