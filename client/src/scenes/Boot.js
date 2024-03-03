import { Scene } from 'phaser';
import { UIHandler } from '../helpers/UIHandler';
import InteractiveHandler from '../helpers/InteractiveHandler';
import CardHandler from '../helpers/CardHandler';
import DeckHandler from '../helpers/DeckHandler';
import SocketHandler from '../helpers/SocketHandler';
import GameHandler from '../helpers/GameHandler';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        //this.load.image('background', 'assets/bg.png');
        this.load.image('tile1', 'assets/tile1.png');
        this.load.image('tile2', 'assets/tile2.png');
        this.load.image('tile3', 'assets/tile3.png');
        this.load.image('tile4', 'assets/tile4.png');
        this.load.image('tile5', 'assets/tile5.png');
        this.load.image('tile6', 'assets/tile6.png');
        this.load.image('bluetile_back', 'assets/bluetile_back.png');
        this.load.image('redtile_back', 'assets/redtile_back.png');
    }

    create ()
    {
        this.CardHandler = new CardHandler();
        this.DeckHandler = new DeckHandler(this);
        this.GameHandler = new GameHandler(this);
        this.SocketHandler = new SocketHandler(this);
        
        this.UIHandler = new UIHandler(this);
        this.UIHandler.buildUI();

        this.InteractiveHandler = new InteractiveHandler(this);
        //this.scene.start('Preloader');
    }

    // could be used later if needed
    update ()
    {

    }
}
