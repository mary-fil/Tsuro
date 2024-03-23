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

    transformSequence(sequence) {
        const pairs = [];
        for (let i = 0; i < sequence.length; i += 2) {
            pairs.push([sequence[i], sequence[i + 1]]);
        }
        return pairs;
    }
    
    rotateRight(sequence) {
        return sequence.map(num => num + 2 <= 8 ? num + 2 : (num + 2) % 8);
    }
    
    rotateLeft(sequence) {
        return sequence.map(num => num - 2 >= 1 ? num - 2 : num - 2 + 8);
    }

    create ()
    {  
        let sequences = [
            [1, 2, 3, 4, 5, 6, 7, 8]
        ];
        let pairs = sequences.map(sequence => this.transformSequence(sequence));

        // create border
        let border = this.add.graphics();
        border.fillStyle(0x336699, 1);
        border.fillRect(450 + 25, 25, 650, 650);

        // create tilemap
        let background = this.add.image(800, 350, 'board');
        
        // 600 : 6 = 100
        // this.map = this.make.tilemap({ tileWidth: 100, tileHeight: 100, width: 6, height: 6 });
        // const tiles = this.map.addTilesetImage('tileset');

        // this.layer = this.map.createBlankLayer('layer', tiles);
        // this.layer.x = 800 - 300;
        // this.layer.y = 350 - 300;

        // let idx = 1;
        // for (let y = 0; y < this.map.height; y++) {
        //     for (let x = 0; x < this.map.width; x++) {
        //         const tile = this.layer.getTileAt(x, y, true);
        //         if (tile) {
        //             tile.properties.name = idx;
        //             tile.properties.pairs = pairs[idx];
        //             idx++;
        //         };
        //     };
        // };

        // this.map.putTileAt(0,0,1);
        // this.map.putTileAtWorldXY(0, 800, 400);

        this.UIHandler = new UIHandler(this);
        this.UIHandler.buildUI();

        // places for markers

        // Define the number of places per side
        const placesPerSide = 12;

        // Define the radius of the circles
        const circleRadius = 8;

        // Define the spacing between board and circles
        const spacing = 3;

        // Create a group to hold all the places
        let placesGroup = this.add.group();

        // Loop to create places for each side
        let coordX = 500 - spacing;
        let coordY = 85;
        for(let i = 1; i <= 2; i++){
            for(let i = 1; i <=placesPerSide/2; i++){
                let place = this.add.circle(coordX, coordY, circleRadius, 0xeecc66);
                // Add the circle to the group
                placesGroup.add(place);

                coordY += 30;
                place = this.add.circle(coordX, coordY, circleRadius, 0xeecc66);
                placesGroup.add(place);
    
                coordY += (50 - 15)*2;
            }
            coordX = 1100 + spacing;
            coordY = 85;
        }
        coordX = 535;
        coordY = 50 - spacing;
        for(let i = 1; i <= 2; i++){
            for(let i = 1; i <=placesPerSide/2; i++){
                let place = this.add.circle(coordX, coordY, circleRadius, 0xeecc66);
                // Add the circle to the group
                placesGroup.add(place);

                coordX += 30;
                place = this.add.circle(coordX, coordY, circleRadius, 0xeecc66);
                placesGroup.add(place);
    
                coordX += (50 - 15)*2;
            }
            coordX = 535;
            coordY = 650 + spacing;
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
