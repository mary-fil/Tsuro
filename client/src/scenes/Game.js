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
        // create border
        let border = this.add.graphics();
        border.fillStyle(0x336699, 1);
        border.fillRect(450 + 25, 25, 650, 650);

        // create tilemap
        let background = this.add.image(800, 350, 'board');
        
        // 612 : 6 = 102
        const map = this.make.tilemap({ tileWidth: 100, tileHeight: 100, width: 6, height: 6 });

        const tiles = map.addTilesetImage('tileset');

        let layer = map.createBlankLayer('layer', tiles);
        layer.x = 800 - 300;
        layer.y = 350 - 300;

        map.putTileAt(1,0,0);

        // handlers
        this.CardHandler = new CardHandler();
        this.DeckHandler = new DeckHandler(this);
        this.GameHandler = new GameHandler(this);
        this.SocketHandler = new SocketHandler(this);
        
        this.UIHandler = new UIHandler(this);
        this.UIHandler.buildUI();

        this.InteractiveHandler = new InteractiveHandler(this);
    }
}
