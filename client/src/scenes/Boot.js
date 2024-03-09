import { Scene } from 'phaser';
// import { UIHandler } from '../helpers/UIHandler';
// import InteractiveHandler from '../helpers/InteractiveHandler';
// import CardHandler from '../helpers/CardHandler';
// import DeckHandler from '../helpers/DeckHandler';
// import SocketHandler from '../helpers/SocketHandler';
// import GameHandler from '../helpers/GameHandler';

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

    }

    create ()
    {
        
        this.scene.start('Preloader');
    }

    update ()
    {

    }
}
