import { Scene } from 'phaser';
import { UIHandler } from '../helpers/UIHandler';
import InteractiveHandler from '../helpers/InteractiveHandler';
import CardHandler from '../helpers/CardHandler';
import DeckHandler from '../helpers/DeckHandler';
import SocketHandler from '../helpers/SocketHandler';
import GameHandler from '../helpers/GameHandler';


export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {  
        // let sequence = sequences[0];
        // let pairs = this.createPairs(sequence);

        // console.log(pairs);
        // console.log(this.rotateLeft(pairs));

        // create border
        let border = this.add.graphics();
        border.fillStyle(0x336699, 1);
        border.fillRect(450 + 25, 25, 650, 650);

        // create tilemap
        let background = this.add.image(800, 350, 'board');

        this.UIHandler = new UIHandler(this);
        this.UIHandler.buildUI();

        // places for markers

        // Define the number of places per side
        const placesPerSide = 12;

        // Define the radius of the circles
        const circleRadius = 8;

        // Create a group to hold all the places
        let placesGroup = this.add.group();

        // Loop to create places for each side
        let coordX = 500;
        let coordY = 85;
        let pos1 = 1;
        let pos2 = 2;
        let pos3 = 3;
        let pos4 = 4;
        let pos5 = 5;
        let pos6 = 6;
        let pos7 = 7;
        let pos8 = 8;
        for(let i = 1; i <= 2; i++){
            for(let i = 1; i <=placesPerSide/2; i++){
                let place = this.add.circle(coordX, coordY, circleRadius, 0xeecc66);
                // Add the circle to the group
                placesGroup.add(place);
                place.setData({
                    position: pos2
                });

                coordY += 30;
                place = this.add.circle(coordX, coordY, circleRadius, 0xeecc66);
                placesGroup.add(place);
                place.setData({
                    position: pos1
                });
    
                coordY += (50 - 15)*2;
            }
            coordX = 1100;
            coordY = 85;
            pos2 = pos5;
            pos1 = pos6;
        }
        coordX = 535;
        coordY = 50;
        for(let i = 1; i <= 2; i++){
            for(let i = 1; i <=placesPerSide/2; i++){
                let place = this.add.circle(coordX, coordY, circleRadius, 0xeecc66);
                // Add the circle to the group
                placesGroup.add(place);
                place.setData({
                    position: pos3
                });

                coordX += 30;
                place = this.add.circle(coordX, coordY, circleRadius, 0xeecc66);
                placesGroup.add(place);
                place.setData({
                    position: pos4
                });
    
                coordX += (50 - 15)*2;
            }
            coordX = 535;
            coordY = 650;
            pos3 = pos8;
            pos4 = pos7;
        }

        placesGroup.children.each((place) => {
            place.setInteractive({ dropZone: true });
        });

        // user wants to rotate left
        // take pairs from the tile
        // rotate it how many times the user wants
        // rotate the sprite aswell
        // update the pairs of the tile

        // handlers
        this.CardHandler = new CardHandler();
        this.DeckHandler = new DeckHandler(this);
        this.GameHandler = new GameHandler(this);
        this.SocketHandler = new SocketHandler(this);

        this.InteractiveHandler = new InteractiveHandler(this, placesGroup);
    }
}
